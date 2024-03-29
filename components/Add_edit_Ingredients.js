import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    ScrollView,
    SafeAreaView,
    ImageBackground,
} from 'react-native';
import firebase from 'firebase/compat';
import {useEffect, useState} from "react";
import { BarCodeScanner } from 'expo-barcode-scanner';


const Add_edit_Ingredients = ({navigation,route}) => {
//Dette er hvad der skal sendes til realtime databasen. 
    const initialState = {
        
        Item: ''
        
    }

    const [newIngredient,setNewIngredient] = useState(initialState);
//Returnere true, hvis vi er på edit ingredient. dermed kan vi lave et if-statement der kun kører koden hvis man er på edit ingredient-siden
    const isEditIngredient = route.name === "Edit Ingredient";


    useEffect(() => {
        if(isEditIngredient){
            const ingredient = route.params.ingredient[1];
            setNewIngredient(ingredient)
        }
//Fjern dataen igen, når vi går væk fra Edit ingredient. Også kaldet en clean-up af useEffect
        return () => {
            setNewIngredient(initialState)
        };
    }, []);

    const changeTextInput = (name,event) => {
        setNewIngredient({...newIngredient, [name]: event});
    }
// navigerer til Barcode scanner, hvilket er en stack.screen i app.js
    const handlePress = () => {
        navigation.navigate("Barcode Scanner")
    }

    const handleSave = () => {

        const { Item } = newIngredient;

//Kontrollerer om felterne er tomme
        if(Item.length === 0){
            return Alert.alert('Et af felterne er tomme!');
        }

        if(isEditIngredient){
            const id = route.params.ingredient[0];
// først prøver man at opdatere ingrediensen
            try {
                firebase
                    .database()
                    .ref(`/Ingredients/${id}`)
                    // Bruger update så kun de angivne felter ændres. De øvrige felter er uændret
                    .update({Item});
              
                Alert.alert("Din ingrediens er nu opdateret");
                const ingredient = [id,newIngredient]
                //skubber en ny route så vi kommer tilbage til ingredient details-siden
                navigation.navigate("Ingredient Details",{ingredient});
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }

        }else{
            
            
// hvis den ikke findes i forvejen så er den jo ny. så ingrediens vi push til at tilføje et nyt datasæt til databasen
            try {
                firebase
                    .database()
                    .ref('/Ingredients/')
                    .push({Item});
                Alert.alert(`Din ingrediens er nu tilføjet`);
                setNewIngredient(initialState)
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
        }

    };
// bruger scrollview så man kan scrolle
//object.keys ændrer objektet til et array med keys
//.map kører funktionen for hver værdi i array'et. derfor bliver textinputtet oprettet til alle værdierne
    return (
        <ImageBackground source={require("../assets/opacity.png")}  style={styles.image} >
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {
                    Object.keys(initialState).map((key,index) =>{
                        return(
                            <View style={styles.row} key={index}>
                                {/* <Text style={styles.label}>{key}</Text> */}
                                
                                <TextInput
                                    value={newIngredient[key]}
                                    onChangeText={(event) => changeTextInput(key,event)}
                                    style={styles.input}
                                    placeholder="Type an ingredient here..."
                                />
                              
                            </View>
                        )
                    })
                }
                {/*Ændrer navnet på knappen til save changes hvis isEditIngredient er true*/}
                 {/*Her har jeg lavet en ny button til barcode scanner. Den kører handlePress-funktionen, som navigerer til BarCodeScanner component*/}
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Button color={"#000000"} title="Scan a barcode" onPress={() => handlePress()} />
                <Text></Text>
                <Button color={"#000000"} title={ isEditIngredient ? "Save changes" : "Add ingredient"} onPress={() => handleSave()} />
            </ScrollView>
        </SafeAreaView>
        </ImageBackground>
    );
}

export default Add_edit_Ingredients;

//layout af elementer på siden
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        margin: 10
    },
    row: {
        flexDirection: 'row',
        height: 30,
        margin: 10,
    },
    label: {
        width: 100,
        fontSize: 20,
        color: `#000000`,
        opacity: 1,
        marginTop: 10
        },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius:10,
        margin: 5,
        padding: 5,
        height: 50,
        fontsize: 50,
        justifyContent:'center',
        textAlign: "center"
        
    },
    image: {
        opacity: 1,
        height: "100%",
        width: "100%"
     }
});