from inMemoryUsers import users
from models.userModels import UserCreate, UserUpdate, SavedUser, UserResponse
import uuid
from datetime import datetime,timezone
from pydantic import ValidationError, TypeAdapter, EmailStr
from core.security import hash_password
from inMemoryUsersWithoutPasswords import UsersWithoutHashPasswords

EMAIL_ADAPTER = TypeAdapter(EmailStr)
async def getAllUsers():
    retUsers = []
    for user in users:
        Retuser = UserResponse(
            id = users[user].id ,
            username= users[user].username,
            email = users[user].email ,
            createdAt = users[user].createdAt ,
        ) 
        retUsers.append(Retuser)
        
    return retUsers

async def createNewUser(newUser:UserCreate):
    newId = str(uuid.uuid4())
    TimecreatedAt = (datetime.now(timezone.utc)).isoformat()
    hashedPassword = hash_password(newUser.password.get_secret_value())
    normalised_email = newUser.email.lower().strip()

    try:
        newUserResponse = UserResponse(
            id = newId,
            username = newUser.username,
            email = normalised_email,
            createdAt = TimecreatedAt
        )

        newUserCreated = SavedUser(
                                    username= newUser.username,
                                    email = normalised_email,
                                    id= newId,
                                    password_hash = hashedPassword,
                                    createdAt = TimecreatedAt)

        #TO DO Remove when database is integrated
        if any( normalised_email == user.email for user in users.values()):
            return "Duplicate email"
        users[newId] = newUserCreated

        return newUserResponse
    except ValidationError as e:
        errors = e.errors()

        if any('username' in err.get('loc', ()) for err in errors):
            return "Username cannot be blank"

        return "Invalid email format"

async def getUserBYID(userID:str):
    for user in users:
        if user == userID:
            retUser = UserResponse(
                id = users[user].id ,
                username= users[user].username,
                email = users[user].email ,
                createdAt = users[user].createdAt
            )
            return retUser
    return None 

async def UpdateLogic(userID: str, user: UserResponse, updateDetails: UserUpdate):

    update_user_data:UserUpdate = updateDetails.model_dump(exclude_unset=True)

    if "username" in update_user_data:
        val = update_user_data["username"] 
        if val is None or not str(val).strip():
            return "Blank username"

    if "email" in update_user_data:
        new_email = update_user_data.get("email")

        if new_email is None or not str(new_email).strip():
            return "Null email"

        normalised_email = str(new_email).lower().strip()
        new_email_str = str(normalised_email).lower()

        for uid, existing_user in users.items():
            existing_email = (
                existing_user.email if hasattr(existing_user, "email") else existing_user.get("email","")
            )
            if uid != userID and existing_email.lower() == new_email_str:
                return "Duplicate email"

        update_user_data["email"] = new_email_str

    for k,v in update_user_data.items():
            # Uses setattr() to bypass 'does not support item assignment'
            setattr(user, k, v)

    curr_user = users.get(userID)
    userToStore = SavedUser(
        username= curr_user.username,
        email = new_email_str,
        id= userID,
        password_hash = curr_user.password_hash,
        createdAt = curr_user.createdAt
    )

    #update the in memory user array
    users[userID] = userToStore 

    userToRet = UserResponse(
        id = user.id,
        username= user.username,
        email = user.email ,
        createdAt = user.createdAt
    )
    return userToRet

async def patchMe(user: UserResponse, updateDetails : UserUpdate):

    if user is None:
        return None 

    userId = user.id

    return await UpdateLogic(userId, user, updateDetails)
    
async def updateUserbyID(userID: str, updateDetails:UserUpdate ):

    user = users.get(userID)

    if user is None:
        return None 

    return await UpdateLogic(userID, user, updateDetails)

async def deleteSelf(user: UserResponse):
    curr_user = user 
    if user is None:
        return "Invalid user"

    curr_user_id = curr_user.id

    users.pop(curr_user_id)

    return UserResponse(
        id = curr_user_id,
        username = curr_user.username,
        email = curr_user.email,
        createdAt = curr_user.createdAt
    )

async def deleteUserBYID(user_id:str):
    user = users.get(user_id)
    if user is None :
        return "User not found"
    else:
        users.pop(user_id)
        tasks = [ t for t in tasks if t.userId != user_id]


    return UserResponse(
        id = user.id ,
        username= user.username,
        email = user.email ,
        createdAt = user.createdAt
    )


 

