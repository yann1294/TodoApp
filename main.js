import './style.css'
import { Client, Databases, ID } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6605a6a5951c6638d663');


const DATABASE_ID = "66c374fd001e81aeca87"

const COLLECTION_ID = "66c37526001721be6608"

const db = new Databases(client)

const taskList = document.getElementById('tasks-list')
const form = document.getElementById('form')

form.addEventListener('submit', addTask)

async function getTasks(){
   const response = db.listDocuments(DATABASE_ID,COLLECTION_ID)
   console.log(
    response
   )
   for(let i = 0; (await response).documents.length > i; i++){
      renderToDom((await response).documents[i])
   }
}

getTasks()

async function renderToDom(task){

    // create task

    const taskWrapper = `<div class="task-wrapper" id="task-${task.$id}">
      <p class="complete-${task.completed}">${task.body}</p>
      <strong class="delete" id="delete-${task.$id}">x</strong>
    </div>`
    taskList.insertAdjacentHTML('afterbegin', taskWrapper)

    // delete task
    const deleteBtn = document.getElementById(`delete-${task.$id}`)

    const wrapper = document.getElementById(`task-${task.$id}`)

    deleteBtn.addEventListener('click', () =>{
      db.deleteDocument(
        DATABASE_ID,COLLECTION_ID,
        task.$id
      )
      wrapper.remove()
    })

    // update task
    wrapper.childNodes[1].addEventListener('click', async (e)=>{
      task.completed = !task.completed
      e.target.className = `complete-${task.completed}`
      db.updateDocument(
        DATABASE_ID,COLLECTION_ID,
        task.$id,
        {'completed':task.completed}
      )
    })
}

async function addTask(e){
  e.preventDefault()

  const taskBody = e.target.body.value

  if(taskBody === ''){
    alert('Form cannot be empty!')
    return
  }
  // appwrite part
  const response = db.createDocument(
    DATABASE_ID,COLLECTION_ID,
    ID.unique(),
    {'body':taskBody}
  )
  renderToDom(response)
  form.reset()
}