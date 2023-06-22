
import todo from "./resources/todo.jpg"
import studentsgathered from "./resources/studentsgathered.jpg"
import videoPlayer from './resources/how-to-videos.jpg'

export const TileContents= [{
    body:"Keep track of all the work you'll need to get done before the semester gets too busy. You can do so using the todo list we've built for you.",
    title: "todo-list",
    backgroundImage: todo,
    link: '/Todolist',
    requireLogin: true

},
{
    title: "Testimonials",
    body: "listen to written and recorded accounts from students who started off in the same place as yourself.",
    backgroundImage: studentsgathered,
    link: '/Testimonials/testimonialList'
},
{
    title: "How-to-videos",
    body: "get a head start on your studies with the video guides we've created to help you navigate the univesity's various student resources.",
    backgroundImage: videoPlayer,
    link: "/videos",
}]