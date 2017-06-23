package middlewares

import "github.com/gin-gonic/gin"

func Dododo(s string) gin.HandlerFunc {
	return func(c *gin.Context) {

		c.Next()
	}
}
