import React, { useEffect, useState, useRef } from 'react';
import DraggableFlatList from "react-native-draggable-flatlist";
import Svg, { Line, Path } from 'react-native-svg';
import TouchableScale from 'touchable-scale-btk';
import { StyleSheet, StatusBar, View, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { Image as CachedImage } from "react-native-expo-image-cache";
import { LinearGradient } from 'expo-linear-gradient';
import { Loading, DayMenu, TaskItem, ProgressBar } from '../components';
import { useAppContext } from '../hooks';
import { sortBy } from 'lodash';
import { StoreUtil, DateUtil } from '../utils';
import { getFormattedTasks } from '../utils/common';
import API from '../api';

const Home = ({ navigation }) => {
  const [activities, setActivities] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [displayData, setDisplayData] = useState(undefined);
  const { tasks, dayDate, setTasks, isEditing, setIsEditing } = useAppContext();

  const flatListRef = useRef();

  useEffect(() => {
    if (tasks && activities) {
      const initialTasks = getFormattedTasks({ tasks, activities, dayDate });

      setDisplayData(sortBy(initialTasks, ['pos', 'added']));
    }
  }, [tasks, activities, dayDate])

  const _refreshHandler = () => {
    console.log("refreshed");

    getActivities([], true);
    API.initSpeech();
  };

  const getActivities = async (activities, force) => {
    const allActivities = await API.getActivities(force);
    setActivities(allActivities);

    API.ramCards(activities, force);
  };

  const syncTasks = async () => {
    try {
      setLoading(true);
      const tasks = await StoreUtil.getItem('@tasks');
      if (tasks) {
        const yesterday = DateUtil.yesterday();
        const today = DateUtil.today();
        const tomorrow = DateUtil.tomorrow();

        const initialTasksObj = {
          [yesterday]: tasks[yesterday] ? tasks[yesterday] : {},
          [today]: tasks[today] ? tasks[today] : {},
          [tomorrow]: tasks[tomorrow] ? tasks[tomorrow] : {},
        };
        setTasks(initialTasksObj);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    API.hit("Home");
    if (API.user.greeding == 1) {
      API.speak(API.t("hello_you", API.user.name));
    }

    API.event.on("refresh", _refreshHandler);
    API.event.on("premium", _refreshHandler);

    getActivities();
    syncTasks();

    return () => {
      API.event.removeListener("refresh", _refreshHandler);
      API.event.removeListener("premium", _refreshHandler);
    };
  }, []);

  const handleEditPress = () => {
    setIsEditing(!isEditing);
  };

  const handleRemoveItem = (slug) => {
    setTasks({
      ...tasks,
      [dayDate]: {
        ...tasks[dayDate],
        [slug]: undefined,
      }
    });
  };

  const handleCompletePress = (slug) => {
    setTasks({
      ...tasks,
      [dayDate]: {
        ...tasks[dayDate],
        [slug]: {
          ...tasks[dayDate][slug],
          completed: tasks[dayDate][slug]['completed'] ? null : DateUtil.now(),
        }
      }
    });
  };

  // TODO: Memoize or populate/update through global state on each action
  const allCount = displayData && displayData.length;
  const completedCount = displayData && displayData.filter(task => task.completed).length;

  const renderTaskItem = ({ item: task, drag, isActive, index }) => {
    return (
      <TaskItem
        data={task}
        onCompletePress={() => handleCompletePress(task.activity && task.activity.slug)}
        onRemoveItem={handleRemoveItem}
        showEditing
        drag={drag}
        isActive={isActive}
        isFirst={index == 0}
        isLast={(index + 1) == allCount}
      />
    );
  };


  const handleDragEnd = ({ data }) => {
    setDisplayData(data);

    let newData = {};

    for (const itemIndex in data) {
      const item = data[itemIndex];
      newData = {
        ...newData,
        [item.activity.slug]: {
          ...item,
          pos: itemIndex
        },
      }
    }
    setTimeout(() => {
      setTasks({ ...tasks, [dayDate]: newData });
    }, 200)

    API.haptics("touch");
  };

  useEffect(() => {
    if (completedCount === allCount) {
      if (flatListRef && flatListRef.current) {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
      }
    }
  }, [completedCount, allCount]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView style={{ backgroundColor: API.config.backgroundColor }}></SafeAreaView>

      <StatusBar backgroundColor={API.config.backgroundColor} barStyle={"light-content"} />

      <SafeAreaView style={{ backgroundColor: API.config.backgroundColor }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[API.styles.h2, { color: "white", marginBottom: 20, marginTop: 20 }]}>{API.t("hello_you", API.user.name)}</Text>

          <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-end" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flex: 1 }}>
              <TouchableOpacity style={styles.avatarHolder} onPress={() => navigation.navigate("Settings")}>
                <View style={styles.avatar}>
                  <CachedImage uri={`${API.assetEndpoint}cards/avatar/${API.user.avatar}.png?v=${API.version}`}
                    style={{ width: 40, height: 40, position: "relative", top: 4 }}
                    resizeMode={"contain"} />
                </View>
                <View style={styles.avatarIcon}>
                  <Svg width={11} height={11} viewBox="0 0 8 4">
                    <Line x1="1" x2="7" y1="0.8" y2="0.8" fill="none" stroke={API.config.backgroundColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" />
                    <Line x1="1" x2="7" y1="3.2" y2="3.2" fill="none" stroke={API.config.backgroundColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" />
                  </Svg>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.content}>
        <View>{(!activities || loading || !displayData) && <Loading />}</View>

        <View style={styles.dayMenu}>
          <DayMenu />
        </View>

        {activities && (
          <>
            {displayData && displayData.length > 0 && (
              <DraggableFlatList
                ref={flatListRef}
                data={displayData}
                ListHeaderComponent={allCount > 0 && <ProgressBar completedCount={completedCount} allCount={allCount} />}
                ListHeaderComponentStyle={{ marginHorizontal: -20 }}
                renderItem={renderTaskItem}
                keyExtractor={(item, index) => `draggable-item-${item.slug}-${index}`}
                onDragEnd={handleDragEnd}
                activationDistance={20}
                contentContainerStyle={{
                  paddingBottom: 400,
                  paddingHorizontal: API.config.globalPadding
                }}
              />
            )}

            {(!displayData || (displayData && displayData.length < 1)) && (
              <View
                style={[
                  styles.item, {
                    padding: 10,
                    flex: 1
                  }]}>
                <CachedImage
                  uri={`${API.assetEndpoint}activities/assets/planning-the-day.png?v=${API.version}`}
                  style={{
                    width: API.isTablet ? 160 * API.artworkAspectRatio : 140 * API.artworkAspectRatio,
                    height: API.isTablet ? 160 : 140,
                    margin: 5,
                    opacity: 0.7
                  }}
                />
                <Text
                  style={[API.styles.h2, {
                    fontSize: 19,
                    marginLeft: 10,
                    marginTop: 10,
                  }]}
                >
                  {API.t("no_tasks_yet")}
                </Text>
                <Text
                  style={[API.styles.p, {
                    marginHorizontal: 25,
                    textAlign: "center",
                    paddingBottom: 100
                  }]}
                >
                  {API.t("no_tasks_yet_desc")}
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      <LinearGradient colors={[API.config.transparentPanelColor, API.config.panelColor, API.config.panelColor]} style={{
        padding: 30,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        zIndex: 99,
        width: "100%",
        height: 90,
      }}>


        {displayData && displayData.length != 0 && <TouchableScale
          style={{
            position: "absolute",
            bottom: 40,
            left: 30,
            backgroundColor: API.config.backgroundColor,
            borderRadius: 25,
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={handleEditPress}>
          {!isEditing && <Svg
            width={24}
            height={24}
            stroke={API.config.panelColor}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 218 218">
            <Path fill={API.config.panelColor} d="M215.658,53.55L164.305,2.196C162.899,0.79,160.991,0,159.002,0c-1.989,0-3.897,0.79-5.303,2.196L3.809,152.086
	c-1.35,1.352-2.135,3.166-2.193,5.075l-1.611,52.966c-0.063,2.067,0.731,4.069,2.193,5.532c1.409,1.408,3.317,2.196,5.303,2.196
	c0.076,0,0.152-0.001,0.229-0.004l52.964-1.613c1.909-0.058,3.724-0.842,5.075-2.192l149.89-149.889
	C218.587,61.228,218.587,56.479,215.658,53.55z M57.264,201.336l-42.024,1.28l1.279-42.026l91.124-91.125l40.75,40.743
	L57.264,201.336z M159,99.602l-40.751-40.742l40.752-40.753l40.746,40.747L159,99.602z" />
          </Svg>}

          {isEditing && <Svg viewBox="0 0 24 24" width={32} height={32}>
            <Path fill={API.config.panelColor} d="M9 16.2l-3.5-3.5c-.39-.39-1.01-.39-1.4 0-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0L9 16.2z"></Path>
          </Svg>}
        </TouchableScale>}

        <TouchableScale
          style={{
            position: "absolute",
            bottom: 40,
            right: 30,
            backgroundColor: API.config.backgroundColor,
            borderRadius: 25,
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={() => navigation.navigate("AddActivity")}>
          <Svg
            width={24}
            height={24}
            stroke={API.config.panelColor}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path fill={API.config.panelColor} d="M12 5v14M5 12h14" />
          </Svg>
        </TouchableScale>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  carrier: {
    flex: 1,
    backgroundColor: "#fff",
    height: "100%"
  },
  header: {
    backgroundColor: API.config.backgroundColor
  },
  avatar: {
    marginHorizontal: 30, padding: 2, backgroundColor: "#fff", borderRadius: 40, overflow: "hidden",
    width: 45,
    height: 45,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee"
  },
  avatarHolder: {
    position: "relative"
  },
  avatarIcon: {
    backgroundColor: "#fff",
    width: 18,
    height: 18,
    position: "absolute",
    bottom: -2,
    right: 28,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  categoryItem: {
    width: "100%"
  },
  categoryItemLandscape: {
    width: "50%"
  },
  board: {
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 15
  },
  categoryItemInner: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
    margin: 5,
    marginHorizontal: 10,
    marginTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  categoryItemText: {
    fontWeight: "bold",
    color: "rgba(0,0,0,0.75)"
  },
  tabStyle: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 20
  },
  tabStyleText: {
    fontWeight: "bold",
    fontSize: 17
  },
  tabStyleActive: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: API.config.backgroundColor,
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  tabStyleActiveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17
  },
  tabHolder: {
    flex: 1, flexDirection: "row", alignItems: "center",
    marginLeft: 20,
    marginTop: 10,
    height: 60,
  },
  dayMenu: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomColor: '#EAEBEE',
    borderBottomWidth: 1,
    paddingVertical: 3
  },
  content: {
    backgroundColor: "#fff",
    flex: 1,
  },
  item: {
    marginVertical: 5,
    borderRadius: 25,
    padding: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  searchItemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "rgba(0,0,0,0.75)",
    paddingRight: 10
  }
});

export default Home;
