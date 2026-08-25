from inMemoryUsers import users
from models.userModels import UserCreate, UserUpdate, SavedUser, UserResponse
import uuid
from datetime import datetime,timezone
from pydantic import ValidationError, TypeAdapter, EmailStr
from core.security import hash_password
from inMemoryUsersWithoutPasswords import UsersWithoutHashPasswords

EMAIL_ADAPTER = TypeAdapter(EmailStr)
async def getAllUsers():
    return list(UsersWithoutHashPasswords.values())

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
        if any( normalised_email == newUserResponse.email for user in users.values()):
            return "Duplicate email"
        users[newId] = newUserCreated
        UsersWithoutHashPasswords[newId] = newUserResponse
        return newUserResponse
    except ValidationError as e:
        errors = e.errors()

        if any('username' in err.get('loc', ()) for err in errors):
            return "Username cannot be blank"

        return "Invalid email format"

async def getUserBYID(userID:str):
    return UsersWithoutHashPasswords.get(userID)

async def updateUserbyID(userID: str, updateDetails:UserUpdate ):

    user = users.get(userID)

    if user is None:
        return None 

    update_user_data:UserUpdate = updateDetails.model_dump(exclude_unset=True)

    if "username" in update_user_data:
        val = update_user_data["username"] 
        if val is None or not str(val).strip():
            return "Blank username"

    if "email" in update_user_data:
        new_email = update_user_data.get("email")
        normalised_email = new_email.lower().strip()


        if normalised_email is None or not str(normalised_email).strip():
            return "Null email"

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

    #update the in memory user array
    users[userID] = user 

    userToRet = UsersWithoutHashPasswords.get(userID)

    return {"message": "User updated successfully" ,"data":userToRet}


async def deleteUserBYID(user_id:str):
    output = users.pop(user_id, "User not found")
    output2 = UsersWithoutHashPasswords.pop(user_id, "User not found")
    return output2
 

