// npm modules
import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import React from "react"

// css
import styles from './ProfilePage.module.css'
import avatar from "../../assets/icons/avatar.png"
import deleteIcon from "../../assets/icons/delete.png"
import topContributor from "../../assets/icons/top-contributor.png"

// services
import * as profileService from '../../services/profileService'
import * as postService from '../../services/postService'

// components
import PostCard from "../../components/PostCard/PostCard"
import Following from "../../components/Following/Following"

const ProfilePage = (props) => {
  const [profile, setProfile] = useState({})
  const { profileId } = useParams()
  const [profilePosts, setProfilePosts] = useState([])
  const [savedProfilePosts, setSavedProfilePosts] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const ProfileData = await profileService.showProfile(profileId)
      setProfile(ProfileData)
      setIsFollowing(ProfileData.followers?.some(p => p === props.user?.profile))
      const postDetails = await Promise.all(
        ProfileData.posts.map(async (postId) => {
          return await postService.show(postId)
        })
      )
      setProfilePosts(postDetails)
      const savedPostDetails = await Promise.all(
        ProfileData.saves.map(async (postId) => {
          return await postService.show(postId)
        })
      )
      setSavedProfilePosts(savedPostDetails)
    }
    fetchProfile()
  }, [profileId, props.user?.profile])

  const handleFollow = async (profileId) => {
    const followerList = await profileService.addFollow(profileId)
    setProfile({ ...profile, followers: followerList })
  }

  const handleUnFollow = async (profileId) => {
    const followerList = await profileService.unFollow(profileId)
    setProfile({ ...profile, followers: followerList })
  }

  const handleDeleteSavedPost = async (profileId, postId) => {
    const saves = await profileService.deleteSavedPosts(profileId, postId)
    setSavedProfilePosts(...saves)
  }

  return (
    <div className={styles.profilePageContainer}>
      <header className={styles.ppHeader}>
        <div className={styles.topContributor}>
          <h1>{profile.name}</h1>
          {profilePosts.length > 5 || profile.followers > 5 ?
            <div>
              <img src={topContributor} alt="topContributorIcon" className={styles.topContributorIcon} />
            </div>
            : ""
          }
        </div>
      </header>
      <div className={styles.ppAvatar}>
        {profile.photo ? (
          <img src={profile.photo} alt="profile image" />
        ) : (
          <img src={avatar} alt="avatar" />
        )}
      </div>
      <div className={styles.ppBio}>
        <p>{profile.bio}</p>
      </div>
      <div className={styles.ppInfo}>
        <h5>Member Since </h5>
        <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
        {props.user?.profile === profileId &&
          <div className={styles.editProfileButton}>
            <Link to={`/profiles/${profileId}/edit`} state={profile} >
              <button>Edit Profile</button>
            </Link>
            <button onClick={() => props.handleDeleteProfile(profileId)}>Delete Profile</button>
            <Link to="/auth/change-password">
              <button>Change Password</button>
            </Link>
          </div>
        }
      </div>
      <div className={styles.followersContainer}>
        {props.user?.profile && (
          <Following
            profile={profile}
            user={props.user}
            handleFollow={handleFollow}
            handleUnFollow={handleUnFollow}
            isFollowing={isFollowing}
          />
        )}
      </div>
      <div className={styles.profilePostsSection}>
        <div className={styles.ppH}>
          <h1>{profile.name}'s Posts</h1>
        </div>
        <div className={styles.profilePosts}>
          {profilePosts &&
            profilePosts
              .filter((post) => post !== null && (post.public || props.user?.profile == post.author?._id)) // Filter out null posts
              .map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
        </div>
      </div>
      {props.user?.profile === profileId && (
        <div className={styles.savedPostsContainer}>
          <h1>{profile.name}'s Saved Posts</h1>
          <div className={styles.savedPosts}>
            {savedProfilePosts &&
              savedProfilePosts
                .filter((post) => post !== null)
                .map((post) => (
                  <React.Fragment key={post._id}>
                    <PostCard key={post._id} post={post} />
                    <button onClick={() => handleDeleteSavedPost(profileId, post._id)}>
                      <img src={deleteIcon} className={styles.deleteIcon} />
                    </button>
                  </React.Fragment>
                ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage