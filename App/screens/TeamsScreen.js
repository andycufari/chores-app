import { React, useEffect, useContext, useState } from 'react';
import { StyleSheet, FlatList, Modal, SafeAreaView } from 'react-native';
import { Formik } from 'formik';
import { LoadingIndicator, View, TextInput, FormErrorMessage } from '../components';
import { Avatar, Button, List, Card, Paragraph, TouchableRipple } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import TeamService from '../services/TeamService.js';
import { auth, storage } from '../config/firebase';
import { Images } from '../config/images';
import { teamAddSchema } from '../utils';

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { TeamContext } from '../providers';


export const TeamsScreen = () => {
  const [errorState, setErrorState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [showTeamModal, setTeamModalVisible] = useState(false);
  const [currentAvatarUri, setCurrentAvatarUri] = useState(Images.default_team)
  const [progress, setProgress] = useState('')
  const { setTeam } = useContext(TeamContext);


  useEffect(async () => {
    const teams = await TeamService.getTeams();

    console.log(teams);
    setTeams(teams);

  }, []);

  const handleTeamModal = (value) => {
    setTeamModalVisible(value);
  }

  const redirectToTeam = (item) => {
    TeamService.setLocalTeam(item);
    setTeam(item);
  }

  const renderItem = ({ item }) => (
    <List.Item
      onPress={() => redirectToTeam(item)}
      title={item.name}
      description="Tu equipo"
      left={props => <Avatar.Image {...props} source={item.image_uri ? { uri: item.image_uri } : Images.default_team} />}
    />
  );


  const teamList = (teams) => {
    return (

      <SafeAreaView style={styles.container}>
        <Card>
          <Card.Title title=""></Card.Title>
          <Card.Content>
            <FlatList
              data={teams}
              renderItem={renderItem}
              keyExtractor={item => item.time}
            />
          </Card.Content>
        </Card>
      </SafeAreaView>
    );
  }

  const addTeam = values => {
    const { name } = values;

    setIsLoading(true);
    let image = null;
    if (typeof (currentAvatarUri.uri) != 'undefined' && currentAvatarUri.uri) {
      image = currentAvatarUri.uri;
    }
    TeamService.addTeam({ name: name, image_uri: image }).then(() => {
      TeamService.getTeams().then((teams) => {
        console.log("TEAMS AFTER SAVE");
        console.log(teams);
        setTeams(teams);
        setIsLoading(false);
        setTeamModalVisible(false);
      });
    })

  };

  const handleLogout = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  const ImageChoiceAndUpload = async () => {
    console.log("Clicked");
    try {
      if (Platform.OS === 'ios') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert("Permission is required for use.");
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        let actions = [];
        actions.push({ resize: { width: 300 } });
        const manipulatorResult = await ImageManipulator.manipulateAsync(
          result.uri,
          actions,
          {
            compress: 0.4,
          },
        );
        const localUri = await fetch(manipulatorResult.uri);
        const localBlob = await localUri.blob();
        const filename = auth.currentUser.uid + new Date().getTime()
        const storageRef = ref(storage, `avatar/${auth.currentUser.uid}/` + filename)
        const uploadTask = uploadBytesResumable(storageRef, localBlob)
        uploadTask.on('state_changed',
          (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(parseInt(progress) + '%')
          },
          (error) => {
            console.log(error);
            alert("Upload failed.");
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setProgress('');
              console.log(downloadURL);
              setCurrentAvatarUri({ uri: downloadURL });
            });
          }
        );
      }
    } catch (e) {
      console.log('error', e.message);
      alert("The size may be too much.");
    }
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={showTeamModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          handleTeamModal(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>

            <Paragraph>Create a team and share tasks with your people!</Paragraph>
            {isLoading ? <LoadingIndicator /> :
              <>
                <Paragraph style={{ textAlign: "center" }}>
                  <TouchableRipple
                    onPress={ImageChoiceAndUpload}>
                    <Avatar.Image
                      size={64}
                      rounded

                      source={currentAvatarUri}
                    />
                  </TouchableRipple>
                </Paragraph>
                <Paragraph>{progress}</Paragraph>
                <Formik
                  initialValues={{
                    name: '',
                    image: ''
                  }}
                  validationSchema={teamAddSchema}
                  onSubmit={values => addTeam(values)}
                >
                  {({
                    values,
                    touched,
                    errors,
                    handleChange,
                    handleSubmit,
                    handleBlur
                  }) => (
                    <>
                      {/* Input fields */}

                      <TextInput
                        name='name'
                        leftIconName='account-supervisor-circle'
                        placeholder='Team name'
                        //autoCapitalize='none'
                        //keyboardType='email-address'
                        //textContentType='emailAddress'
                        autoFocus={false}
                        value={values.name}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                      />
                      <FormErrorMessage
                        error={errors.name}
                        visible={touched.name}
                      />

                      {/* Display Screen Error Mesages */}
                      {errorState !== '' ? (
                        <FormErrorMessage error={errorState} visible={true} />
                      ) : null}

                      <Button
                        mode="contained"
                        title={'Save team'}
                        onPress={handleSubmit}
                      >Save Team</Button>

                      <Button

                        mode="outlined"

                        onPress={() => { handleTeamModal(false) }}
                      >Cancel</Button>


                    </>
                  )}
                </Formik>
              </>
            }

          </View>
        </View>
      </Modal>

      {teams ? teamList(teams) : <Paragraph>No hay equipos.</Paragraph>}

      <Button
        icon="plus"
        uppercase={true}
        mode="contained"
        onPress={() => handleTeamModal(true)}>
        Create Team
      </Button>


      <Button onPress={handleLogout} >Sign Out</Button>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
