// npm modules
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"

// services
import * as profileService from '../../services/profileService'

// css
import styles from './FollowerList.module.css'
import avatar from "../../assets/icons/avatar.png"

const FollowerList = () => {
  const [followerList, setFollowerList] = useState([])
  const { profileId } = useParams()

  useEffect(() => {
    try {
      const fetchFollowers = async () => {
        const followerData = await profileService.showFollowers(profileId)
        setFollowerList(followerData)
      }
      fetchFollowers()
    } catch (error) {
      console.error(error)
    }
  }, [profileId])

  return (
    <div className={styles.followersListContainer}>
      <h1>Followers: </h1>
      {followerList.length === 0 ? (
        <p>No followers yet</p>
      ) : (
        followerList.map((follower) => (
          <Link key={follower._id} to={`/profiles/${follower._id}`}>
            <img src={follower.photo || avatar} alt="profile image" />
            <p>{follower.name}</p>
          </Link>
        ))
      )}
    </div>
  )
}

export default FollowerList