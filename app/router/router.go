package router

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/motopig/hodor/app/common"
	"github.com/motopig/hodor/app/controllers/admin"
)

func Routers() {

	gin.SetMode("debug")
	r := gin.New()

	r.Static("/resources", "./app/resources")
	r.StaticFile("/favicon.ico", "./favicon.ico")

	r.LoadHTMLGlob("app/templates/*/*")

	sessionConn := common.Hconfig.String("session::host") + ":" + common.Hconfig.String("session::port")
	sessionSecret := common.Hconfig.String("session::secret")
	sessionDatabase := common.Hconfig.String("session::database")
	store, _ := sessions.NewRedisStoreWithDB(10, "tcp", sessionConn, sessionSecret, sessionDatabase, []byte(common.Hconfig.String("session::keysecret")))

	r.Use(sessions.Sessions("hodor", store))
	//r.Use(middlewares.Dododo("huake"))

	loginGroup := r.Group("/admin")
	{
		loginGroup.GET("/login", admin.Login)
		loginGroup.POST("/dologin", admin.DoLogin)
	}

	authGroup := r.Group("/admin").Use(admin.AuthRequire)
	{
		authGroup.GET("/home", admin.Home)
	}

	r.Run(":9002")
}
