import React from 'react';
import { View, Button } from 'react-native';
import i18n from '../../../i18n';

const LanguageSwitcher: React.FC = () => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
            <Button title="Français" onPress={() => i18n.changeLanguage('fr')} />
            <Button title="عربي" onPress={() => i18n.changeLanguage('ar')} />
        </View>
    );
};

export default LanguageSwitcher;