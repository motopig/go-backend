package admin

import (
	"encoding/base64"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/motopig/hodor/app/common"
	"github.com/motopig/hodor/app/model"
)

func Login(c *gin.Context) {

	c.HTML(http.StatusOK, "login.tmpl", gin.H{
		"body": "admin website",
	})
}

func DoLogin(c *gin.Context) {

	name := c.PostForm("name")
	password := c.PostForm("password")

	// check user auth
	user := new(User)
	model.Gorm().Where(&User{Name: name, Password: password}).First(user)
	if user.Name == "" {
		c.String(http.StatusForbidden, "Hello Sucker %s %s", "FFFuck", "OOOf")
		c.Abort()
		return
	}

	//c.SetCookie("uname", base64.StdEncoding.EncodeToString([]byte(name)), 7200, "/", "sucker.fuck", false, true)
	session := sessions.Default(c)
	session.Set("uname", base64.StdEncoding.EncodeToString([]byte(name)))
	session.Options(sessions.Options{
		Path:     "/",
		Domain:   common.Hconfig.String("domain"),
		MaxAge:   7200,
		Secure:   false,
		HttpOnly: true,
	})
	session.Save()
	c.Redirect(http.StatusMovedPermanently, "/admin/home")
}

func AuthRequire(c *gin.Context) {
	session := sessions.Default(c)
	u := session.Get("uname")
	if u == nil {
		c.Redirect(http.StatusMovedPermanently, "/admin/login")
	}
	c.Next()
}
