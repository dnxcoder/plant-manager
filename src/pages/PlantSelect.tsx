import { Fontisto } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/core';

import colors from '../../assets_aula01/styles/colors';
import { EnviromentButton } from '../components/EnviromentButton';


import { Header } from '../components/Header'
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Load } from '../components/Load';

import api from '../services/api';
import fonts from '../styles/fonts';


import { PlantProps } from '../libs/storage';


interface EnviromentProps {
    key: string;
    title: string;
}




export function PlantSelect() {

    const [environments, setEnvironments] = useState<EnviromentProps[]>([]);
    const [plants, setPlants] = useState<PlantProps[]>([]);
    const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
    const [enviromentSelected, setEnviromentSelected] = useState('all');
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const navigation = useNavigation();

    function handleEnvironmentSelected(environment: string) {

        setEnviromentSelected(environment);

        if (environment === 'all')
            return setFilteredPlants(plants);

        const filtered = plants.filter(plant =>
            plant.environments.includes(environment) // return all the plants that includes the enviroment

        );

        setFilteredPlants(filtered);
    }

    function handleFetchMore(distance: number) {

        if (distance < 1) {

            return;
        }

        setLoadingMore(true);
        setPage(oldValue => oldValue + 1)
        fetchPlants();

    }

    function handlePlantSelect(plant: PlantProps){

        navigation.navigate('PlantSave', { plant });
        

    }

    async function fetchPlants() {

        const { data } = await api
            .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

        if (!data)
            return setLoading(true);

        if (page > 1) {
            setPlants(oldValue => [...oldValue, ...data]); // getting the old value with the new data together
        } else {
            setPlants(data);
            setFilteredPlants(data);
        }

        setLoading(false);
        setLoadingMore(false);

    }



    useEffect(() => {

        async function fetchEnviroment() {

            const { data } = await api
                .get('plants_environments?_sort=name&_order=asc');
            setEnvironments([
                {
                    key: 'all',
                    title: 'Todos'
                },
                ...data // using the spread operator to spread all items of array
            ]);

        }

        fetchEnviroment();

    }, []);

    useEffect(() => {

        fetchPlants();

    }, []);

 
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />
                <Text style={styles.title}>
                    Em qual ambiente
            </Text>
                <Text style={styles.subtitle}>
                    você quer colocar sua  planta?
            </Text>
            </View>
            <View style={{ paddingHorizontal: 20 }}>
                <FlatList
                    data={environments}
                    keyExtractor={(item, index) => `${item.key}`}
                    renderItem={({ item }) => (
                        <EnviromentButton
                            title={item.title}
                            active={item.key === enviromentSelected}
                            onPress={() => handleEnvironmentSelected(item.key)}
                        />)}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                />
            </View>
            <View style={styles.plants}>
                <FlatList
                    data={filteredPlants}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <PlantCardPrimary
                            data={item}
                            onPress={() => handlePlantSelect(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    onEndReachedThreshold={0.1} // When user reachs 10% of the end of the screen
                    onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
                    ListFooterComponent={
                        loadingMore ?
                            <ActivityIndicator color={colors.green} />
                            :
                            <></>
                    }
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    header: {
        paddingHorizontal: 30
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading,
    },
    enviromentList: {
        paddingBottom: 5,
        marginVertical: 32
    },
    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center',
    },
    contentContainerStyle: {
        justifyContent: 'center'
    }
})