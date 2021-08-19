import firebase from "firebase";
import "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDVBh9VDi9cw5uG32HdfZMoWcGiyW4p7Ps",
    authDomain: "movie-listapp.firebaseapp.com",
    databaseURL: "https://movie-listapp-default-rtdb.firebaseio.com",
    projectId: "movie-listapp",
    storageBucket: "movie-listapp.appspot.com",
    messagingSenderId: "255887247786",
    appId: "1:255887247786:web:e5024080c0ea788162c3d3"
  };

  class Fire {
    constructor(callback) {
        this.init(callback);
    }
    init(callback) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                callback(null, user);
            } else {
                firebase
                    .auth()
                    .signInAnonymously()
                    .catch((error) => {
                        callback(error);
                    });
            }
        });
    }
    getLists(callback) {
        let ref = this.ref.orderBy('name');

        this.unsubscribe = ref.onSnapshot(snapshot => {
            lists = []
            snapshot.forEach(doc => {
                lists.push({
                    id: doc.id,
                    ...doc.data()
                })
            })

            callback(lists);
        })
    }
    addList(list) {
        let ref = this.ref;

        ref.add(list);
    }

    updateList(list) {
        let ref = this.ref

        ref.doc(list.id).update(list);
    }

    get userId() {
        return firebase.auth().currentUser.uid;
    }

    get ref() {
        return firebase.firestore().collection('users').doc(this.userId).collection('lists');
    }

    detach() {
        this.unsubscribe();
    }
}

export default Fire;