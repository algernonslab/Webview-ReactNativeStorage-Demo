import { AsyncStorage } from 'react-native';

export default class Storage
{
    setItem(key, value) 
    {
        if (typeof value !== 'string')
        {
            value = JSON.stringify(value);
        }
       return AsyncStorage.setItem(key, value);
    }

    getItem(key, defaultValue) 
    {
        return AsyncStorage.getItem(key);
    }

    removeItem (key)
    {
        return AsyncStorage.removeItem(key);
    }
}