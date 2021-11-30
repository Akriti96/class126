import *as React from "react"
import { View, Button, Text, Platform } from "react-native"
import *as ImagePicker from "expo-image-picker"
import *as Permissions from "expo-permissions"
import axios from "axios"

export default class Picker extends React.Component {
    constructor() {
        super()
        this.state = {
            image: null,
            finalOutput: []
        }
    }

    getPermission = async () => {
        // here if the given condition is to check the platform is not equal web only getiing permission to open gallery
        if (Platform.OS !== "web") {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            // if the permission is not granted show alert messeage
            if (status !== "granted") {
                alert(" sorry, give permission to camera")
            }
        }
    }

    componentDidMount() {
        this.getPermission()
    }


    //  creating a function to check digit uploaded from gallery
    // uploadImage taking uri as parameter i.e image uri

    uploadImage = async (uri) => {

        // FormData is used to create HTML form(the data structure of the form is similar to json data ) to fetch data from api
        // reference https://www.freecodecamp.org/news/formdata-explained/

        const Data = new FormData()


        //  split the data of the image uri
        var filename = uri.split("/")[uri.split("/").length - 1]

        //  display name of the image or filename
        // example its display filename.jpg or filename.png
        // console.log(filename) 


        // type display the selected image is jpg or png type
        var type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        // console.log(type)

        //created the const variable to store uri, filename, image type in json format
        const fileupload = {
            uri: uri,
            name: filename,
            type: type
        }


        // Data.append used to append a key-value pair to the object. If the key already exists, the value is appended to the original value for that key,
        Data.append("digit", fileupload)

        // class 125 api link you have to run and create ngrok link(i.e https link)
        const url = "https://3cfe-36-255-86-117.ngrok.io/predit-digit"

        // in class 125 we used post method to predict digit same method we are adding by using axios functions
        await axios({
            method: "POST",
            url: url,
            data: Data,
            config: {
                headers: {
                    "Content-type": "multipart/form-data",
                }
            }
        })

        //.then is used to check are getting true response from api
            .then((response) => response)

            // after getting response feching result 
            .then((result) => {
                console.log("Sucess:", result.data)
                this.setState({
                    finalOutput: result.data
                })
                //console.log(this.state.finalOutput)
            })
            .catch((error) => {
                console.error("Error :", error)

            })

    }

    pickImage = async () => {
        /* using try method to open gallery after getting camera permission
         ImagePicker.launchImageLibraryAsync is function is used to choose image or video from phone library
          its takes many options
         1. mediaTypes= Choose what type of media to pick. Defaults its always choose ImagePicker.MediaTypeOptions.Images.
      
         2. aspect is used to create crop option similar to our whatsapp profile 
            or when we choose any images we will transperent rectangle to crop the image i.e called aspect
            here  aspect: [8, 10] means [x,y] 
         
         3. allowsEditing (boolean) -- Whether to show a UI to edit the image/video after it is picked. Images: On Android the user can crop and rotate the image and on iOS simply crop it.
            Videos: On iOS user can trim the video. Defaults to false.
 
         4.quality (number) -- Specify the quality of compression, from 0 to 1. 0 means compress for small size, 
            1 means compress for maximum quality.
 
         
         */
        try {
            var result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                aspect: [8, 10],
                allowsEditing: true,
                quality: 1
            })

            // we are using logical operator(NOT) !true = false !false= true
            if (!result.cancelled) {
                this.setState({
                    image: result.uri
                })
            
                console.log(result)
                this.uploadImage(result.uri)
            }

        }

        catch (E) {
            console.log(E)
        }
    }



     /* used JSON.stringify convert object data string */
    render() {

        return (

            <View style={{ alignItems: "center", marginTop: 200 }}>
                <Button title="Take a picture from Gallary" color="red" onPress={this.pickImage} />
                <Text style={{ marginTop: 40, textAlign: "center", fontSize: 25, fontWeight: "bold" }}>
                    {JSON.stringify(this.state.finalOutput)}</Text>
            </View>
        )
    }
}
