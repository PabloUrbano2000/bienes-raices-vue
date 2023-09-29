import { ref, computed, onMounted } from "vue";
import { defineStore } from "pinia";
import { useFirebaseAuth } from "vuefire";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const auth = useFirebaseAuth();
  const authUser = ref(null);
  const router = useRouter();

  const errorMsg = ref("");

  const errorCodes = {
    "auth/user-not-found": "Usuario no encontrado",
    "auth/invalid-login-credentials": "Usuario no encontrado",
    "auth/wrong-password": "El password es incorrecto",
  };

  onMounted(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        authUser.value = user;
      }
    });
  });

  const login = ({ email, password }) => {
    errorMsg.value = "";
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        authUser.value = user;
        errorMsg.value = "";
        router.push({ name: "admin-propiedades" });
      })
      .catch((err) => {
        errorMsg.value = errorCodes[err.code];
      });
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        authUser.value = null;
        router.push({ name: "login" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const hasError = computed(() => {
    console.log(errorMsg.value);
    return errorMsg.value;
  });

  const isAuth = computed(() => {
    return authUser.value;
  });

  return {
    login,
    hasError,
    errorMsg,
    isAuth,
    logout,
  };
});
