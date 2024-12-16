package main 

import (
	"fmt"
	"os"
	"embed"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/django/v3"
	"github.com/gofiber/fiber/v2/middleware/filesystem"

	"github.com/kryshhzz/koi/views"
)

//go:embed templates/html/*
var embeddedTemplates embed.FS

//go:embed templates/js/*
var embedStatic embed.FS

func main() {

	if len(os.Args) > 1 {
		views.CPATH = os.Args[1]
	}else{
		cwd, err := os.Getwd()
		if err != nil {
			panic(err)
		}
		views.CPATH = cwd
	}

	engine := django.NewFileSystem(http.FS(embeddedTemplates), ".html")

	app := fiber.New(fiber.Config{
		Views: engine,
	})

	app.Use("/static", filesystem.New(filesystem.Config{
		Root: http.FS(embedStatic),
		PathPrefix: "templates/js",
		Browse: true,
	}))
	
	app.Get("/", views.HomeView)
	app.Post("/file/", views.GetFile)
	app.Post("/save/", views.SaveFile)
	app.Get("/close/", func(ctx *fiber.Ctx) error {
		fmt.Println("Thanks for using KOI;")
		err := app.Shutdown()
		if err != nil {
			fmt.Println(err)
			panic("")
		}
		return ctx.SendString("")
	})

	PORT := 6969

	fmt.Println("starting koi")

	for {
		err := app.Listen(fmt.Sprintf(":%d", PORT))
		if err != nil {
			PORT++
			continue
		}
		break
	}
}
