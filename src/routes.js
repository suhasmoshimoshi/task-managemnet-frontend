const routes = {
    authentication : {
        signup : "/api/users/register",
        login:"/api/users/login",
        google:"/api/users/google"
    },
    task:{
        getOrCreate : "/api/tasks" , 
        editOrDelete: (id)=>`/api/tasks/${id}`

    }

}


export default routes