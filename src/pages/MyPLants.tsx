import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    Alert
} from 'react-native';
import { Header } from '../components/Header';
import colors from '../styles/colors';

import waterdrop from '../assets/waterdrop.png';
import { PlantProps, loadPlants, removePlant } from '../libs/storage'
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale'
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';


export function MyPlants() {

    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextWaterd, setNextWatered] = useState<string>();

    function handleRemove(plant: PlantProps) {

        Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
            {
                text: 'Não 🙏',
                style: 'cancel'
            },
            {
                text: 'Sim 😢',
                onPress: async () => {

                    try {
                        
                        await removePlant(plant.id)

                        setMyPlants(oldData => {
                            return oldData.filter((item) => item.id !== plant.id) // return me every item that are diferent from plant.id
                        });
                    } catch (error) {
                        Alert.alert('Não foi possível remover ! 😢');
                    }
                }
            }
        ])
    }

    useEffect(() => {

        async function loadStorageData() {

            const plantStoraged = await loadPlants();


            /* next step is calculating how long will take from now to the time chosen from the user */
            const nextTime = formatDistance(
                new Date(plantStoraged[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                { locale: pt }
            );

            setNextWatered(
                `Não esquece de regar a ${plantStoraged[0].name} daqui à ${nextTime} .`
            )

            setMyPlants(plantStoraged);
            setLoading(false);
        }

        loadStorageData();
    }, [])


    if (loading) {
        return <Load />
    }

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.spotlight}>
                <Image
                    source={waterdrop}
                    style={styles.spotlightImage}
                />
                <Text style={styles.spotlightText}>
                    {nextWaterd}
                </Text>
            </View>

            <View style={styles.plants}>
                <Text style={styles.plantsTitle}>
                    Próximas regadas
                </Text>
                <View style={styles.containerFlatList}>
                    <FlatList
                        data={myPlants}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <PlantCardSecondary
                                data={item}
                                handleRemove={() => { handleRemove(item) }}
                            />)}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({


    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background
    },

    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    spotlightImage: {
        width: 60,
        height: 60,

    },
    spotlightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
        textAlign: 'justify'
    },
    plants: {
        flex: 1,
        width: '100%'
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20
    },
    containerFlatList: {
        flex: 1,
    }
})