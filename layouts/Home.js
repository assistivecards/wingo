import React, { useEffect, useState } from 'react';
import DraggableFlatList from "react-native-draggable-flatlist";
import Svg, { Line, Path } from 'react-native-svg';
import TouchableScale from 'touchable-scale-btk';
import { StyleSheet, StatusBar, View, SafeAreaView, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Image as CachedImage } from "react-native-expo-image-cache";
import { LinearGradient } from 'expo-linear-gradient';
import { Loading, DayMenu, TaskItem, ProgressBar } from '../components';
import { useAppContext } from '../hooks';
import { StoreUtil, DateUtil } from '../utils';
import { sortByKey, getFormattedTasks } from '../utils/common';
import API from '../api';

const Home = ({ navigation }) => {
  const [activities, setActivities] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [displayData, setDisplayData] = useState(undefined);
  const { tasks, dayDate, setTasks } = useAppContext();
  const { isEditing, setIsEditing } = useAppContext();

  useEffect(() => {
    if (tasks && activities) {
      const initialTasks = getFormattedTasks({ tasks, activities, dayDate });
      setDisplayData(sortByKey(initialTasks, 'pos'));
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
    if (API.user.greeding) {
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

  const renderTaskItem = ({ item: task, drag, isActive }) => {
    return (
      <TaskItem
        data={task}
        onCompletePress={() => handleCompletePress(task.activity && task.activity.slug)}
        onRemoveItem={handleRemoveItem}
        showEditing
        drag={drag}
        isActive={isActive}
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

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView style={{ backgroundColor: API.config.backgroundColor }}></SafeAreaView>

      <StatusBar backgroundColor={API.config.backgroundColor} barStyle={"light-content"} />

      {/* <ScrollView
        stickyHeaderIndices={[1]}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={"on-drag"}
        style={{ flex: 1, backgroundColor: API.config.backgroundColor }}
        contentContainerStyle={{ flexGrow: 1 }}
      >

        <SafeAreaView>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={[API.styles.h1, { color: "white", marginBottom: 20, marginTop: 20 }]}>{API.t("hello_you", API.user.name)}</Text>

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

          <TouchableOpacity onPress={handleEditPress}>
            <Text style={[API.styles.sub, { marginHorizontal: 30, marginBottom: 15, color: "#fff", fontWeight: "normal" }]}>{!isEditing ? API.t("edit_list") : API.t("complete_editing")}</Text>
          </TouchableOpacity>
        </SafeAreaView>

        <SafeAreaView>
          <View style={styles.dayMenu}>
            <DayMenu />
          </View>
        </SafeAreaView>

        <View style={styles.content}>
          <View>{(!activities || loading || !displayData) && <Loading />}</View>
          {activities && (
            <>
              {allCount > 0 && <ProgressBar completedCount={completedCount} allCount={allCount} />}

              <View
                style={{
                  paddingHorizontal: API.config.globalPadding,
                }}>
                {displayData && displayData.length > 0 && sortByKey(displayData, 'added').map((task, index) => (
                  <TaskItem
                    key={index}
                    data={task}
                    onCompletePress={() => handleCompletePress(task.activity && task.activity.slug)}
                    onRemoveItem={handleRemoveItem}
                    showEditing
                  />
                ))}
                {(!displayData || (displayData && displayData.length < 1)) && (
                  <Text
                    style={[API.styles.p, {
                      textAlign: 'center',
                      marginTop: 20
                    }]}>
                    + {API.t('add_tasks_title')}
                  </Text>
                )}
              </View>
            </>
          )}
        </View>

        <View style={API.styles.iosBottomPadder}></View>
      </ScrollView> */}

      <View style={{ padding: 20 }}>
        {displayData && displayData.length > 0 && (
          <DraggableFlatList
            data={displayData}
            style={{ width: "100%" }}
            renderItem={renderTaskItem}
            keyExtractor={(item, index) => `draggable-item-${item.slug}-${index}`}
            onDragEnd={handleDragEnd}
          />
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
        <TouchableScale
          style={{
            position: "absolute",
            bottom: 40,
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
    position: "relative",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '100%',
    borderBottomColor: '#EAEBEE',
    borderBottomWidth: 1,
    paddingVertical: 3
  },
  content: {
    backgroundColor: "#fff",
    height: '100%',
  },
});

export default Home;
