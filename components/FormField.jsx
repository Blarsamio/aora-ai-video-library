import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons }  from '../constants'

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props}) => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-smoke-100">{title}</Text>

      <View className="w-full h-16 px-4 bg-onix-100  rounded-lg focus:border-2 focus:border-secondary items-start">
        <TextInput
          className="flex-1 text-smoke text-base font-pregular"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#CCCCCC"
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
          {...props}
        />

        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image source={!showPassword ? icons.eye : icons.eyeHide } className="w-6 h-6" resizeMode='contain'/>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField
