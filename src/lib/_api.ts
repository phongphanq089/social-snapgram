/* eslint-disable @typescript-eslint/no-explicit-any */
import { INewPost, INewUser } from '@/types'
import { account, appwriteConfig, avatars, databases, storage } from './appwrite/config'
import { ID, Query } from 'appwrite'

// ============ || SIGN IN || ===============
export const createUserAccount = async (user: INewUser) => {
  try {
    const newAccount = await account.create(ID.unique(), user.email, user.password, user.name)

    const avatarUrl = avatars.getInitials(user.name)

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.userName,
      imageUrl: avatarUrl
    })
    if (!newAccount) throw Error
    return newUser
  } catch (error) {
    console.log(error, 'createUserAccount')
    return error
  }
}

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  accountId: string
  email: string
  name: string
  imageUrl: URL
  username?: string
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    )

    return newUser
  } catch (error) {
    console.log(error, 'saveUserToDB')
  }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password)

    console.log(session, 'session signInaccount')
    return session
  } catch (error) {
    console.log(error, 'signInAccount')
  }
}

// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    const currentAccount = await account.get()
    console.log(currentAccount, 'getAccount')
    return currentAccount
  } catch (error) {
    console.log(error, 'getAccount')
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount()
    console.log(currentAccount, 'getCurrentUser')
    if (!currentAccount) throw Error
    const currentUser = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.userCollectionId, [
      Query.equal('accountId', currentAccount.$id)
    ])
    console.log(currentUser, 'currentUser')
    if (!currentUser) throw Error

    return currentUser.documents[0]
  } catch (error) {
    console.log(error, 'getCurrentUser')
  }
}

// ============================== SIGNOUT USER
export async function signOutAccount() {
  try {
    const session = account.deleteSession('current')
    return session
  } catch (error) {
    console.log(error, 'sign out error')
  }
}

// ============================== CREATE POST
export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0])

    if (!uploadedFile) throw Error

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id)
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, '').split(',') || []

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags
      }
    )

    console.log(newPost, 'newPost - Create Posts')
    if (!newPost) {
      console.log(newPost, 'newPost - Create Posts erroras')
      await deleteFile(uploadedFile.$id)
      throw Error
    }
    return newPost
  } catch (error) {
    console.log(error, 'createPost')
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(appwriteConfig.storageId, ID.unique(), file)

    return uploadedFile
  } catch (error) {
    console.log(error)
  }
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, 'top', 100)

    if (!fileUrl) throw Error

    return fileUrl
  } catch (error) {
    console.log(error, 'etFilePreview')
  }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId)

    return { status: 'ok' }
  } catch (error) {
    console.log(error, 'deleteFile')
  }
}

// ============================== GET POPULAR POSTS (BY HIGHEST LIKE COUNT)
export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.postCollectionId, [
      Query.orderDesc('$createdAt'),
      Query.limit(20)
    ])

    if (!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
  }
}

// ============================== ACTION POST =====//
//=================================================//

// ============================== LIKE POST
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray
      }
    )

    if (!updatedPost) throw Error
    return updatedPost
  } catch (error) {
    console.log(error, 'like-post')
  }
}

// ============================== SAVE POST
export async function savePost(userId: string, postId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId
      }
    )

    if (!updatedPost) throw Error
    return updatedPost
  } catch (error) {
    console.log(error, 'save-post')
  }
}

// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      savedRecordId
    )

    if (!statusCode) throw Error

    return { status: 'Ok' }
  } catch (error) {
    console.log(error, 'deleteSavedPost')
  }
}

//================================ GET POSTID
export async function getPostByid(postId?: string) {
  if (!postId) throw Error

  try {
    const post = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.postCollectionId, postId)

    if (!post) throw Error

    return post
  } catch (error) {
    console.log(error)
  }
}

//================================ SEARCH POST
export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.postCollectionId, [
      Query.search('caption', searchTerm)
    ])
    if (!posts) throw Error

    return posts
  } catch (error) {
    console.log(error, 'searchPosts')
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(9)]

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()))
  }

  try {
    const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.postCollectionId, queries)

    if (!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
  }
}

export async function getInfiniteUser({ pageParam }: { pageParam: number }) {
  const queries = [Query.limit(10)]

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()))
  }
  try {
    const users = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.postCollectionId, queries)
    if (!users) throw Error

    return users
  } catch (error) {
    console.log(error)
  }
}

export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc('$createdAt')]

  if (limit) {
    queries.push(Query.limit(limit))
  }

  try {
    const users = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.userCollectionId, queries)

    if (!users) throw Error

    return users
  } catch (error) {
    console.log(error)
  }
}
