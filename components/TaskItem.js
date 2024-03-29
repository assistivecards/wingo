import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import TouchableScale from 'touchable-scale-btk';
import ActivityItem from './ActivityItem';
import { useAppContext } from '../hooks'
import API from '../api';

const TaskItem = ({
  data,
  onCompletePress,
  onRemoveItem,
  showEditing,
  drag,
  isActive,
  isFirst,
  isLast
}) => {
  const { activity, completed } = data;

  const { isEditing } = useAppContext();

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        opacity: (showEditing && isEditing)? 1 : completed ? 0.6 : 1,
      }}
    >
      {!(showEditing && isEditing) &&
        <View
          style={{
            borderLeftWidth: 3,
            borderLeftColor: 'rgba(99, 110, 182, 0.15)',
            height: (isFirst || isLast) ? '500%' : '100%',
            position: 'absolute',
            top: isFirst ? "-5%" : 0,
            left: 19,
            zIndex: 0,
          }}
        />
      }
      {!(showEditing && isEditing) &&
        <TouchableScale onPress={() => onCompletePress()}>
        <View
          style={{
            width: '15%',
            maxWidth: 40,
            minWidth: 40,
            height: 40,
            borderRadius: 100,
            backgroundColor: API.config.panelColor,
            borderColor: 'rgba(99, 110, 182, 0.8)',
            borderWidth: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {completed ? (
            <Svg width={24} height={24}>
              <Path
                d="M8 21a1.99 1.99 0 0 1-1.414-.586l-6-6a2.001 2.001 0 0 1 0-2.828c.78-.78 2.047-.78 2.828 0L8 16.172 20.586 3.586c.78-.78 2.047-.78 2.828 0 .78.78.78 2.047 0 2.828l-14 14c-.39.39-.902.586-1.414.586z"
                fill={API.config.backgroundColor}
                fillRule="evenodd"
              />
            </Svg>
          ) : undefined}
        </View>
      </TouchableScale>}
      <View
        style={{
          width: !(showEditing && isEditing) ? '85%' : '100%',
          paddingLeft: 5,
          marginBottom: 10,
          transform: [{
            scale: isActive ? 1.05 : 1
          }],
        }}>
        <ActivityItem
          data={activity}
          showEditing={showEditing}
          onRemoveItem={onRemoveItem}
          drag={drag}
          isActive={isActive}
        />
      </View>
    </View>
  );
};
export default TaskItem;
