package main 

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/django/v3"

	"github.com/kryshhzz/koi/views"
)

func main() {

	KOIPATH := os.Getenv("HOME")
	if len(os.Args) > 1 {
		KOIPATH = os.Args[1]
	}

	engine := django.New(KOIPATH+"/.KOI/templates/html", ".html")

	app := fiber.New(fiber.Config{
		Views: engine,
	})
	app.Static("static", KOIPATH+"/.KOI/templates/css")

	cwd, err := os.Getwd()
	if err != nil {
		panic(err)
	}
	views.CPATH = cwd
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
		err = app.Listen(fmt.Sprintf(":%d", PORT))
		if err != nil {
			PORT++
			continue
		}
		break
	}
}
