import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextStyle } from 'react-native';

interface TextAreaFieldProps {
    content: string;
    type: 'inputtype1' | 'inputtype2';
    onWordCountChange: (count: number) => void;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({ content, type ,onWordCountChange}) => {
    const [formattedContent, setFormattedContent] = useState<string>('');
    const [isFocused, setIsFocused] = useState<boolean>(false);


    const handleTextChange = (text: string) => {

        const wordCount = text.trim().split(/\s+/).length;

        // Capitalize the first letter of each word after a space
        const formattedText = text.replace(/(\w+)/g, (word) => {
            const trimmedWord = word.trim();
            return trimmedWord.charAt(0).toUpperCase() + trimmedWord.slice(1);
        });

        setFormattedContent(formattedText);
        onWordCountChange(wordCount);

        if (wordCount >= 12) {
            setIsFocused(false);
        } else {
            setIsFocused(true);
        }

    };


    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        if (formattedContent.trim().split(/\s+/).length < 12) {
            setIsFocused(true);
        } else {
            setIsFocused(false);
        }

    };

    const styles = {
        inputtype1: {
            text: {
                fontSize: 16,
                textAlignVertical: 'top' as TextStyle['textAlignVertical'],
                borderWidth: 1,
                borderColor: isFocused ? '#733DF5' : '#CBCBCC',
                borderRadius: 10,
                padding: 10,
                color:'black'
            },
            placeholdercolor: '#898A8E',
        },
        inputtype2: {
            text: {
                fontSize: 16,
                textAlignVertical: 'top' as TextStyle['textAlignVertical'],
                orderWidth: 1,
                borderColor: isFocused ? '#733DF5' : '#CBCBCC',
                borderRadius: 10,
                padding: 10,
                color:'black'
            },
            placeholdercolor: '#ffffff',
        },
    };

    return (
        <View style={style.container}>
            <TextInput
                style={styles[type].text}
                placeholder={content}
                placeholderTextColor={styles[type].placeholdercolor}
                multiline
                numberOfLines={5}
                value={formattedContent}
                onChangeText={handleTextChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        width: '90%',
        height: 'auto',
    },
});

export default TextAreaField;
