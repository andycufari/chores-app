
import { auth } from '../config/firebase';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firestore = getFirestore();

const TeamService = {

    setLocalTeam: async (team) => {
        try {
            await AsyncStorage.setItem('currentTeam', JSON.stringify(team))
        } catch (e) {
            return null;
        }
    },

    getLocalTeam: async () => {
        try {
            const result = await AsyncStorage.getItem('currentTeam');
            // return JSON.parse(result);
            return JSON.parse(result);
        } catch (e) {
            return null;
        }
    },

    addTeam: async (team) => {

        let user_id = auth.currentUser.uid;
        let d = new Date();

        return addDoc(collection(firestore, "teams"), {
            name: team.name,
            image_uri: team.image_uri,
            time: d.getTime() / 1000,
            user_id: user_id
        });

    },

    getTeams: async () => {

        try {

            const user_id = auth.currentUser.uid;
            const q = query(collection(firestore, "teams"), where("user_id", "==", user_id));
            const teamSnap = await getDocs(q);
            const teamList = teamSnap.docs.map(doc => doc.data());
            return teamList;

        } catch (e) {
            console.log("ERROR FIREBASE!>");
            console.log(e);
            return null;
        }
    }
};

export default TeamService;