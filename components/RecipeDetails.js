import * as React from 'react';
import { View, ScrollView, Text, Platform, FlatList, StyleSheet, Button, Alert, ImageBackground, Image } from 'react-native';
import firebase from 'firebase/compat';
import {useEffect, useState} from "react";
import { recipearray } from './Algorithm';
import { ingredientarray } from './IngredientList';

let matchArray = []
let noMatchArray = []

//Henter billederne af retterne
const images = [
   { id: 1, uri: require('../assets/recipe1instructions.png') },   
   { id: 2, uri: require('../assets/recipe2instructions.png') }, 
   { id: 3, uri: require('../assets/recipe3instructions.png') },   
   { id: 4, uri: require('../assets/recipe4instructions.png') }, 
   { id: 5, uri: require('../assets/recipe5instructions.png') } 
]



const RecipeDetails = ({route,navigation}) => {
    const [recipe,setrecipe] = useState({});

    useEffect(() => {
        // Henter recipe values fra databasen
        
        setrecipe(route.params.recipe[0]);
       // tømmer objektet når man forlader RecipeDetails skærmen
        return () => {
            setrecipe({})
        }
    });

    const changeView = () => {
        // Vi navigerer videre til Editingredient skærmen og sender bilen videre med
       
        navigation.navigate('Instructions', route.params.id);
    };

//Laver et temp array med values fra recipe 
var temp = Object.values(recipe)

//Går igennem alle values i recipe og smider over i hhv. array med matches og et uden for at adskille dem
temp.forEach(element => {
    if(ingredientarray.includes(element)){
        matchArray.push(element)
        
    }
    else{
        noMatchArray.push(element)
    }
})

//Laver de to arrays om til objekter
let noMatchObjectArray = Object.assign({}, noMatchArray);
let matchObjectArray = Object.assign({}, matchArray);
//Tæller antal matches med ingredients
let countMatchArray = matchArray.length
//Tømmer arrays
matchArray = []
noMatchArray = []



// hvis der ikke er data i databasen. det burde der være når man er på Details-skærmen
    if (!recipe) {
        return <Text>No data</Text>;
    }

    // Nu kommer det brugeren rent faktisk kan se
    // to knapper, der kører de før specificerede funktioner
    // herefter vises både keys og values
    return (
        <ImageBackground source={require("../assets/opacity.png")}  style={styles.image} >
        <ScrollView style={styles.container}>
        
            
            {
                
                    
                        <View style={styles2.row}>
                            <Text style={styles2.value}>Antal matchende ingredienser: {countMatchArray}</Text>
                            
                        </View>
                    
                
            }

{
                Object.entries(matchObjectArray).map((item1,index1)=>{
                    return(
                        <View style={styles.row} key={index1}>
                           
                            <Text style={styles.value}>{item1[1]}</Text>
                        </View>
                    )
                })
            }

            {
                Object.entries(noMatchObjectArray).map((item1,index1)=>{
                    return(
                        <View style={styles1.row} key={index1}>
                          
                            <Text style={styles1.value}>{item1[1]}</Text>
                        </View>
                    )
                })
            }
            
           
        </ScrollView>
        <View style={{margin: 10}}>
        <Button color={"#000000"} title="Instructions" onPress={ () => changeView()}/>
        </View>
        </ImageBackground>
       
    );

    
}

export default RecipeDetails;

//Styles af component
const styles = StyleSheet.create({
    container: { flex: 1},
    row: {
        margin: 5,
        padding: 5,
        flexDirection: 'row',
    },
    label: { width: 100, fontWeight: 'bold' },
    value: { flex: 1, color: 'green', fontSize: 20, textTransform: "capitalize"},
    image: {
        opacity: 1,
        height: "100%",
        width: "100%"
     }
});

const styles1 = StyleSheet.create({
    container: { flex: 1 },
    row: {
        margin: 5,
        padding: 5,
        flexDirection: 'row',
    },
    label: { width: 100, fontWeight: 'bold' },
    value: { flex: 1, color: "red", fontSize: 20, textTransform: "capitalize"},
});

const styles2 = StyleSheet.create({
    container: { flex: 1},
    row: {
        margin: 5,
        padding: 5,
        flexDirection: 'row',
    },
    label: { width: 100, fontWeight: 'bold' },
    value: { flex: 1, fontWeight: 'bold', fontSize: 20 },
});