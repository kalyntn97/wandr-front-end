//npm modules
import { useState } from 'react'
//components
import EditComment from '../EditComment/EditComment'
import AuthorInfo from '../AuthorInfo/AuthorInfo'
//css
import styles from './CommentCard.module.css'

const CommentCard = (props) => {
  const [showForm, setShowForm] = useState(false)

  const showEditCommentForm = () => {
    setShowForm(true)
  }
 
  return ( 
    <article>
      <header>
        {<AuthorInfo content={props.comment}/>}
      </header>
      <p>{props.comment.text}</p>
      {props.comment.author === props.user.profile._id && <button onClick={() => showEditCommentForm()}>Edit</button>}
      {props.comment.author === props.user.profile._id && <button onClick={() => props.handleDeleteComment(props.comment._id)}>Delete</button>}
      
      {/* show edit comment form on button click */}
      {showForm && <EditComment comment={props.comment} handleEditComment={props.handleEditComment} />}
    </article>
   )
}
 
export default CommentCard