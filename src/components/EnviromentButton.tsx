import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import colors from '../styles/colors';
import fonts from '../styles/fonts';


interface EnviromentButtonProps extends RectButtonProps {

    title: string;
    active?: boolean; // the interrogative means that active is not obrigatory

}

export function EnviromentButton({ title, active = false, ...rest }: EnviromentButtonProps) {

    return (
        <RectButton
            style={[
                styles.container,
                active && styles.containerActive

            ]}
            {...rest}
        >
            <Text style={[
                styles.text,
                active && styles.textActive
            ]}>
                {title}
            </Text>
        </RectButton>
    )
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: colors.shape,
        height: 40,
        width: 76,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginHorizontal: 5
    },
    text: {
        color: colors.heading,
        fontFamily: fonts.text
    },
    containerActive: {

        backgroundColor: colors.green_light
    },
    textActive: {
        color: colors.green_dark,
        fontFamily: fonts.heading,

    }

})