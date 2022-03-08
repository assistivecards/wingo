import React, { useEffect, useState } from 'react';
import { StyleSheet, StatusBar, View, SafeAreaView, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Image as CachedImage } from "react-native-expo-image-cache";
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Line, Path } from 'react-native-svg';
import TouchableScale from 'touchable-scale-btk';
import { Loading, SearchItem, DayMenu } from '../components';
import { useAppContext, useForceUpdate } from '../hooks';
import { StoreUtil, DateUtil } from '../utils';
import API from '../api';

const Home = ({ navigation }) => {
  const forceUpdate = useForceUpdate();
  const [activities, setActivities] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const { tasks, day, dayDate, setTasks } = useAppContext();

  useEffect(() => {
    console.log('day:', day);
  }, [day]);
  useEffect(() => {
    console.log('dayDate:', dayDate);
  }, [dayDate]);

  const _refreshHandler = () => {
    console.log("refreshed");
    forceUpdate();
    // not affecting, todo
  };

  const getActivities = async (activities, force) => {
    const allActivities = await API.getActivities(force);
    setActivities(allActivities);

    API.ramCards(activities, force);
  };

  const isEmptyObject = (obj) => {
    return JSON.stringify(obj) === '{}';
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
    API.speak(API.t("hello_you", API.user.name));

    API.event.on("refresh", _refreshHandler);
    API.event.on("premium", _refreshHandler);

    getActivities();
    syncTasks();

    return () => {
      API.event.removeListener("refresh", _refreshHandler);
      API.event.removeListener("premium", _refreshHandler);
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor={API.config.backgroundColor} barStyle={"light-content"} />

      <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" keyboardDismissMode={"on-drag"} style={{ flex: 1, backgroundColor: API.config.backgroundColor }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-end" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flex: 1 }}>
              <TouchableOpacity style={styles.avatarHolder} onPress={() => navigation.navigate("Settings")}>
                <View style={styles.avatar}>
                  <CachedImage uri={`${API.assetEndpoint}cards/avatar/${API.user.avatar}.png?v=${API.version}`}
                    style={{ width: 40, height: 40, position: "relative", top: 4 }}
                    resizeMode={"contain"}
                  />
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
        </SafeAreaView>

        <SafeAreaView>
          <Text style={[API.styles.h1, { color: "white", marginBottom: 40 }]}>Hello, {API.user.name}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          </View>

          <View style={styles.content}>

            <DayMenu />

            <View>{!activities || loading && <Loading />}</View>

            {activities && (
              <>
                <View style={{ borderBottomColor: 'grey', borderBottomWidth: 1, opacity: 0.2, paddingVertical: 3 }} />

                <View style={{ paddingVertical: 10, paddingHorizontal: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ height: 10, width: 30, backgroundColor: API.config.backgroundColor, opacity: 0.7, margin: 4, marginLeft: 0 }} />
                    <View style={{ height: 10, width: 30, backgroundColor: API.config.backgroundColor, opacity: 0.7, margin: 4 }} />
                    <View style={{ height: 10, width: 30, backgroundColor: API.config.backgroundColor, opacity: 0.3, margin: 4 }} />
                    <View style={{ height: 10, width: 30, backgroundColor: API.config.backgroundColor, opacity: 0.3, margin: 4 }} />
                    <View style={{ height: 10, width: 30, backgroundColor: API.config.backgroundColor, opacity: 0.3, margin: 4 }} />
                    <View style={{ height: 10, width: 30, backgroundColor: API.config.backgroundColor, opacity: 0.3, margin: 4 }} />
                    <View style={{ height: 10, width: 30, backgroundColor: API.config.backgroundColor, opacity: 0.3, margin: 4 }} />
                    <View style={{ height: 10, width: 30, backgroundColor: API.config.backgroundColor, opacity: 0.3, margin: 4 }} />
                  </View>
                  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>2/8</Text>
                </View>

                <View>
                  {tasks && activities && activities.filter(activity => tasks[dayDate] && tasks[dayDate][activity.slug]).map((task, index) => (
                    <SearchItem
                      key={index}
                      result={task}
                      width={"100%"}
                    />
                  ))}
                  {tasks && (isEmptyObject(tasks) || isEmptyObject(tasks[dayDate])) && (
                    <Text style={{ textAlign: 'center' }}>Add some tasks for {day}</Text>
                  )}
                </View>
              </>
            )}
          </View>
          <View style={API.styles.iosBottomPadder}></View>
        </SafeAreaView>
      </ScrollView>

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
  content: {
    backgroundColor: "#fff",
    position: "relative",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
    height: '100%',
  },
});

export default Home;
