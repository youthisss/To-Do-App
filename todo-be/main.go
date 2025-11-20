package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"todo-app/models"
)

var DB *gorm.DB

func main() {
	errEnv := godotenv.Load()
	if errEnv != nil {
		log.Fatal("Error loading .env file")
	}

	dsn := os.Getenv("DB_DSN")

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Gagal koneksi ke Database! Cek konfigurasi di file .env")
	}
	fmt.Println("Database Terhubung")

	DB.AutoMigrate(&models.Category{}, &models.Todo{})

	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/api/categories", func(c *gin.Context) {
		var categories []models.Category
		DB.Find(&categories)
		c.JSON(http.StatusOK, gin.H{"data": categories})
	})

	r.POST("/api/categories", func(c *gin.Context) {
		var input models.Category
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		DB.Create(&input)
		c.JSON(http.StatusOK, gin.H{"data": input})
	})

	r.DELETE("/api/categories/:id", func(c *gin.Context) {
		id := c.Param("id")
		DB.Model(&models.Todo{}).Where("category_id = ?", id).Update("category_id", 0)
		result := DB.Unscoped().Delete(&models.Category{}, id)

		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": true})
	})

	r.GET("/api/todos", func(c *gin.Context) {
		var todos []models.Todo
		query := DB.Preload("Category").Order("created_at desc")

		categoryID := c.Query("category_id")
		if categoryID != "" && categoryID != "0" {
			query = query.Where("category_id = ?", categoryID)
		}

		search := c.Query("search")
		if search != "" {
			query = query.Where("title ILIKE ?", "%"+search+"%")
		}

		query.Find(&todos)
		c.JSON(http.StatusOK, gin.H{"data": todos})
	})

	r.POST("/api/todos", func(c *gin.Context) {
		var input models.Todo
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		DB.Create(&input)
		c.JSON(http.StatusOK, gin.H{"data": input})
	})

	r.PUT("/api/todos/:id", func(c *gin.Context) {
		var todo models.Todo
		if err := DB.First(&todo, c.Param("id")).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
			return
		}
		var input map[string]interface{}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		DB.Model(&todo).Updates(input)
		DB.Preload("Category").First(&todo, todo.ID)
		c.JSON(http.StatusOK, gin.H{"data": todo})
	})

	r.DELETE("/api/todos/:id", func(c *gin.Context) {
		var todo models.Todo
		if err := DB.First(&todo, c.Param("id")).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
			return
		}
		DB.Delete(&todo)
		c.JSON(http.StatusOK, gin.H{"data": true})
	})

	r.Run(":8080")
}
