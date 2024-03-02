import { StatusBar } from 'expo-status-bar';
import {
  Alert,
  StyleSheet,
  SafeAreaView,
  SectionList,
  View
} from 'react-native';
import {
  useState
} from 'react';
import {
  PaperProvider,
  Avatar,
  Text,
  Divider,
  Surface,
  TouchableRipple,
  IconButton
} from 'react-native-paper';

// TODOs
// hide parents on child view but have back button
// hide parents header and replace with middle section for dating/married to/engaged to
// show relationship status inline in item

const data = [
  {
    id: 1,
    name: "God",
    relationshipType: "single",
    children: [
      { 
        id: 2,
        relationshipType: "married", 
        husband: {name: "Bob", isParentsChild: true, id: 2, uri: ""},
        wife: {name: "Barb", id: 2, uri: ""},
        children: [
          {
            id: 3,
            relationshipType: "married", 
            husband: {name: "John", id: 3},
            wife: {name: "Kathy", id: 3, isParentsChild: true},
            children: [
              {
                id: 6,
                relationshipType: "married", 
                husband: {name: "John", id: 6}, 
                wife: {name: "Alex", id: 6, isParentsChild: true},
              },
              {
                id: 7,
                relationshipType: "dating", 
                boyfriend: {name: "Nick", id: 7}, 
                girlfriend: {name: "Jessica", id: 7, isParentsChild: true}, 
              },
              {
                id: 8,
                relationshipType: "single",
                name: "Becca"
              }
            ]
          },
          {
            id: 4,
            relationshipType: "married", 
            husband: {name: "Rob", id: 4, isParentsChild: true}, 
            wife: {name: "Ann Marie", id: 4},
            children: [
              {
                id: 9,
                relationshipType: "dating", 
                boyfriend: {name: "Robert", id: 9, isParentsChild: true}, 
                girlfriend: {name: "Karem", id: 9,}
              },
              {
                id: 10,
                relationshipType: "single",
                name: "Julia"
              },
              {
                id: 11,
                relationshipType: "single",
                name: "Andrew" 
              },
              {
                id: 12,
                relationshipType: "single",
                name: "Jacob" 
              },
              {
                id: 13,
                relationshipType: "single",
                name: "Lydia" 
              }
            ]
          },
          {
            id: 5,
            relationshipType: "married", 
            husband: {name: "Jim", id: 5, isParentsChild: true}, 
            wife: {name: "Shelly", id: 5},
            children: [
              {
                id: 14,
                relationshipType: "engaged", 
                boyfriend: {name: "Ethan", id: 14, isParentsChild: true}, 
                girlfriend: {name: "Hailey", id: 14}
              },
              {
                id: 15,
                relationshipType: "single",
                name: "Elena"
              },
              {
                id: 16,
                relationshipType: "single",
                name: "Luke" 
              }
            ]
          }
        ]
      }
    ]
  }
]

export default function main() {
  function _findSectionById(id, parent, child) {
    if (parent && parent.id === id) {
      return {
        parent: parent,
        section: parent
      }
    }
  
    if (child && child.id === id) {
      return {
        parent: parent,
        section: child
      }
    }
  
    for (const section of child.children) {
      // we found a match! return it
      if (section.id === id) {
        return {
          parent: child,
          section
        }
      }
  
      if (section.children) {
        const matches = section.children
          .map(child => {
            return _findSectionById(id, section, child);
          })
          .filter(child => child != null);
  
        if (matches.length > 0) {
          return matches[0];
        }
      }
    }
  }
  
  function _getOrderedSection(section) {
    if (section.relationshipType === "married") {
      return section.husband.isParentsChild ? [section.husband, section.wife]: [section.wife, section.husband];
    }
  
    if (section.relationshipType === "engaged" || section.relationshipType === "dating") {
      return section.boyfriend.isParentsChild ? [section.boyfriend, section.girlfriend]: [section.girlfriend, section.boyfriend];
    }
  
    return section;
  }
  
  function _transformChildSectionToViewModel(section) {
    if (section.relationshipType === "married") {
      return section.husband.isParentsChild ? section.husband: section.wife;
    }
  
    if (section.relationshipType === "engaged" || section.relationshipType === "dating") {
      return section.boyfriend.isParentsChild ? section.boyfriend: section.girlfriend;
    }
  
    return section;
  }
  
  function _transformToViewModel(parentSection, childSection) {
    let result = [
      {
        title: "Parents",
        data: parentSection.relationshipType === "single" ? [_getOrderedSection(parentSection)]: _getOrderedSection(parentSection)
      }
    ];

    if (childSection.relationshipType === "single") {
      result.push({
        title: "Child",
        data: [_getOrderedSection(childSection)]
      });
    }
    if (childSection.relationshipType === "married") {
      result.push({
        title: "Married Couple",
        data: _getOrderedSection(childSection)
      });
    }
    if (childSection.relationshipType === "engaged") {
      result.push({
        title: "Engaged Couple",
        data: _getOrderedSection(childSection)
      });
    }
    if (childSection.relationshipType === "dating") {
      result.push({
        title: "Dating Couple",
        data: _getOrderedSection(childSection)
      });
    }
  
    if (childSection.hasOwnProperty("children") && childSection.children.length > 0) {
      result.push({
        title: "Children",
        data: childSection.children.map(_transformChildSectionToViewModel)
      });
    }
  
    return result;
  }
  
  function _loadSectionById(id) {
    if (!id) {
      const section = _findSectionById(2, null, data[0]);
      return _transformToViewModel(section.parent, section.section);
    }
  
    const section = _findSectionById(id, null, data[0]);
      return _transformToViewModel(section.parent, section.section);
  }
  
  const [viewData, setViewData] = useState(_loadSectionById());
  
  function _updateState(item) {
    try {
      const section = _loadSectionById(item.id);
      setViewData(section);
    } catch (e) {
      console.log(e);
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
      backgroundColor: "#673AB7"
    },
    item: {
      backgroundColor: '#D1C4E9',
      marginVertical: 12,
      marginHorizontal: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center'
    },
    avatar: {
      margin: 16
    },
    sectionHeader: {
      width: 'auto',
      marginHorizontal: 12,
    },
    header: {
      fontSize: 32,
      color: '#fff',
      marginHorizontal: 12,
      textAlign: 'center'
    },
    title: {
      color: "#000"
    },
    detailsIcon: {
      flexGrow: 1,
      alignItems: 'flex-end',
      alignContent: 'flex-end',
      paddingRight: 16
    }
  });

  return (
      <SafeAreaView style={styles.container}>
        <PaperProvider>
        <SectionList
          style={styles.list}
          sections={viewData}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => (
            <TouchableRipple onPress={() => _updateState(item)} rippleColor="rgba(209, 196, 233, .32)">
              <Surface style={styles.item} elevation={3}>
                <Avatar.Text style={styles.avatar} size={32} label={item.name.charAt(0)} />
                <Text style={styles.title} variant="headlineSmall">{item.name}</Text>
                <View style={styles.detailsIcon}>
                  <IconButton
                    icon="account-details"
                    iconColor="#673AB7"
                    size={26}
                    mode='contained'
                    onPress={() => Alert.alert('Pressed')}
                  />
                </View>
              </Surface>
            </TouchableRipple>
          )}
          renderSectionHeader={({section: {title}}) => (
            <Surface style={styles.sectionHeader} elevation={0}>
              <Text style={styles.header}>{title}</Text>
              <Divider />
            </Surface>
          )}
        />
        </PaperProvider>
      </SafeAreaView>
  );
}