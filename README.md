# README

# Vercel deployed link => https://zupay-assignment.vercel.app/login

# Flow of applicaiton  =>

    1. User needs to register and then login.
    
    2. On successfully signing user sees all the posts posted by others on its homepage.
    
    3. Here user can open the post and can see comments on the posts and can add comment to the other's post.
    
    4. User can switch to tab where he/she can see its posts posted where all the posts posted by hi,/her will be visible
    
    5. Now user can edit them delete them or view them.
    
    6. user can search the title by typing in search box , he/she can search on his/her posts as well as on all other's post as well.
    
    7. By clicking on create post tab one can create a new post with image , title and description.

# Some Keys of project (Optimization Techniques Used)  =>

    1. Used AWS S3 Bucket to store the images so that we do not overload our Databse in terms of storage and better optimization
    
    2. Used Debounce technique on search functionality to optimize the network calls.
    
    3. Used Redux toolkit to manage the state accross application so that to avoid prop drilling.

    
# Technologies used  =>

    1. ReactJs
    2. NodeJs
    3. express
    4. MongoDB
    5. Antd
    6. Tailwind CSS
    7. Amazon Web Service (AWS) S3 Bucket (for image stored in cloud bucket )
    8. Jsonwebtoken for authorization of the user
    7. Redux toolkit


