import { View, Text } from 'react-native'
import React from 'react'

const InfoBox = ({ title, subtitle, containerStyle, titleStyles }) => {
  return (
    <View className={containerStyle}>
      <Text className={`text-smoke text-center font-psemibold ${titleStyles}`}>{title}</Text>
      <Text className="text-sm text-smoke-200 text-center font-pregular">{subtitle}</Text>
    </View>
  )
}

export default InfoBox
