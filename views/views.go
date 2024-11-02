package views

import (
	"os"
	"strings"
	"log"
	_"sync" 

	"github.com/gofiber/fiber/v2"
) 

type FILE struct {
	Name string `json:"name"`  
	Path string `json:"path"` 
	Content string `json:"content"`
	Size int `json:"size"`
}
type DIR struct {
	Name string  `json:"name"`
	Files []FILE `json:"files"`
	Dirs []DIR `json:"dirs"`
}

var CPATH string 
var CDIR DIR  

func findFiles(path string,tdir *DIR)  {  
	pl := strings.Split(path, "/")   
	tdir.Name = pl[len(pl)-1] 

	dir,err := os.Open(path)
	if err != nil {
		log.Fatal(err)
	}
	defer dir.Close()

	entries,err := dir.Readdir(-1)
	if err != nil {
		log.Println("Error reading directory:", err)
		return
	}

	for _,f := range entries {
		if f.IsDir() {    
				var t2dir DIR 
				findFiles(path+"/"+f.Name(),&t2dir) 
				tdir.Dirs = append(tdir.Dirs, t2dir)     
		} else {
			tf := FILE{
				Name : f.Name(),   
				Path : path+"/"+f.Name(),
				Size : int(f.Size() / ( 1024 * 1024 )),
			}
			tdir.Files = append(tdir.Files,tf)
		}
	}   
	
} 

func HomeView(c *fiber.Ctx) error { 
	CDIR = DIR{}
	findFiles(CPATH,&CDIR)   

	return c.Render("index", fiber.Map{
		"Title": "Koi",
		"cPath": CPATH,
		"cDir":  CDIR.Name, 
		"Dirs" : CDIR,
	}) 
}

func GetFile(c *fiber.Ctx) error{
	var nf FILE
	err := c.BodyParser(&nf)
	if err != nil { 
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}
	cont,err := os.ReadFile(nf.Path)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot open "+nf.Path,
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"content" : string(cont),
	})
} 

func SaveFile(c *fiber.Ctx) error{
	var nf FILE
	err := c.BodyParser(&nf)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}
	err = os.WriteFile(nf.Path, []byte(nf.Content), 0644)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot write to "+nf.Path,
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message" : "SUCCESS",
	})
}