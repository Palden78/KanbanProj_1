from inMemoryUsers import users
from models.userModels import UserCreate, UserUpdate, SavedUser
import uuid
from datetime import datetime,timezone
from pydantic import ValidationError

async def getAllUsers():
    return list(users.values())

async def createNewUser(newUser:UserCreate):
    newId = str(uuid.uuid4())
    TimecreatedAt = (datetime.now(timezone.utc)).isoformat()

    try:
        newUserCreated = SavedUser(username= newUser.username,
                            email = newUser.email,
                            id= newId,
                            createdAt = TimecreatedAt)

        #TO DO Remove when database is integrated
        if any( user.email == newUserCreated.email for user in users.values()):
            return "Duplicate email"
        users[newId] = newUserCreated
        return newUserCreated
    except ValidationError as e:
        errors = e.errors()

        if any('username' in err.get('loc', ()) for err in errors):
            return "Username cannot be blank"

        return "Invalid email format"

    

async def getUserBYID(userID:str):
    return users.get(userID)

async def updateUserbyID(userID: str, updateDetails:UserUpdate ):

    user = users.get(userID)

    if user is None:
        return None 

    update_user_data = updateDetails.model_dump(exclude_unset=True)

    for k,v in update_user_data.items():
        # Uses setattr() to bypass 'does not support item assignment'
        setattr(user, k, v)

    users[userID] = user 

    return {"message": "User updated successfully" ,"data":user}


async def deleteUserBYID(user_id:str):
    output = users.pop(user_id, "User not found")
    return output
 

