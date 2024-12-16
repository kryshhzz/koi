package views

import (
	"bufio"
	"log"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"

	"github.com/kryshhzz/koi/themes"
	"github.com/kryshhzz/koi/themes/koi/golang" 
	"github.com/kryshhzz/koi/themes/koi/html"
)

type FILE struct {
	Name    string `json:"name"`
	Ext     string `json:"ext"`
	Path    string `json:"path"`
	Content string `json:"content"`
	Size    int    `json:"size"`
}
type DIR struct {
	Name  string `json:"name"`
	Files []FILE `json:"files"`
	Dirs  []DIR  `json:"dirs"`
}

var CPATH string
var CDIR DIR

func findFiles(path string) DIR {
	wg := sync.WaitGroup{}
	tempDir := DIR{}
	splittedPath := strings.Split(path, "/")
	tempDir.Name = splittedPath[len(splittedPath)-1]

	d, err := os.Open(path)
	if err != nil {
		log.Fatal(err)
	}
	entry, err := d.Readdir(0)
	if err != nil {
		log.Fatal(err)
	}

	for _, e := range entry {
		if e.IsDir() {
			wg.Add(1)
			go func(nm string) {
				tempDir.Dirs = append(tempDir.Dirs, findFiles(path+"/"+nm))
				wg.Done()
			}(e.Name())
		} else {
			farr := strings.Split(e.Name(), ".")
			tf := FILE{
				Name:    e.Name(),
				Ext:     farr[len(farr)-1],
				Path:    path + "/" + e.Name(),
				Content: "",
				Size:    int(e.Size() / (1024 * 1024)),
			}
			tempDir.Files = append(tempDir.Files, tf)
		}
	}

	wg.Wait()
	return tempDir
}

func HomeView(c *fiber.Ctx) error {

	start := time.Now()
	CDIR = DIR{}
	CDIR = findFiles(CPATH)
	duration := time.Since(start)
	log.Printf("Rputine Time taken for loading files : %v\n", duration)

	return c.Render("templates/html/index", fiber.Map{
		"Title":   "Koi",
		"cPath":   CPATH,
		"DirName": CDIR.Name,
		"Dirs":    CDIR,
	})
}

func GetFile(c *fiber.Ctx) error {
	var nf FILE
	start := time.Now()

	err := c.BodyParser(&nf)
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	} 
	//log.Println(nf)
	cont, err := os.ReadFile(nf.Path)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot open " + nf.Path,
		})
	}

	keywords := []themes.KEYWORD{}

	extslice := strings.Split(nf.Name, ".")

	switch extslice[len(extslice)-1] {
	case "go":
		keywords = golang.KEYWORDS
		break
	case "html":
		keywords = html.KEYWORDS
		break
	}
	duration := time.Since(start)
	log.Printf("Time taken for loading (%v) : %v\n", nf.Name, duration)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"content":  string(cont),
		"keywords": keywords,
	})
}

func SaveFile(c *fiber.Ctx) error {
	var nf FILE
	start := time.Now()

	err := c.BodyParser(&nf)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}
	//log.Println(nf)

	// Open the file
	file, err := os.OpenFile(nf.Path, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot open file " + nf.Path,
		})
	}
	defer file.Close()

	// Create a buffered writer for the file
	writer := bufio.NewWriter(file)

	// Write content using the buffered writer
	_, err = writer.WriteString(nf.Content)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Error writing to file",
		})
	}

	// Flush the buffer to ensure all data is written to the file
	err = writer.Flush()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Error flushing the buffer to file",
		})
	}

	duration := time.Since(start)
	log.Printf("Time taken for saving (%v) : %v\n", nf.Name, duration)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "SUCCESS",
	})
}
