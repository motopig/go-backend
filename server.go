package main

import (
	"fmt"

	"github.com/motopig/hodor/app/common"
	"github.com/motopig/hodor/app/model"
	"github.com/motopig/hodor/app/router"
)

func main() {

	common.InitConfig()
	model.InitMysql()
	common.InitCache()

	fmt.Println(common.Hcache.Get("admin"))
	router.Routers()

}
