<template>
  <div class="min-h-full flex flex-col justify-center items-center">
    <div class="my-10 md:max-w-2xl md:w-full border-2 rounded-xl">
      <!-- Form Block -->
      <div class="mx-5 md:mx-0 md:px-20 pt-10 md:pt-20">
        <div>
          <h2
            class="text-black text-3xl md:text-4xl font-bold text-center md:mb-20"
          >
            Tell us about yourself!
          </h2>
        </div>

        <div class="mt-10 flex flex-col md:text-lg">
          <label> Name:</label>
          <SimpleInput
            v-model="v$.form.name.$model"
            :validator="v$.form.name"
            @on-input="(val) => setLocalStorageValue('name', val)"
            extraClass="name"
            label="Name"
          />
        </div>
        <div class="my-2 flex flex-col md:text-lg">
          <label> Age:</label>
          <SimpleInput
            v-model="v$.form.age.$model"
            :validator="v$.form.age"
            @on-input="(val) => setLocalStorageValue('age', val)"
            extraClass="age"
            label="Age"
          />
        </div>
        <div class="my-2 flex flex-col md:text-lg">
          <label> Where do you live:</label>
          <select
            v-model="form.location"
            class="mt-2 py-3 px-2 border-2 rounded-lg location"
            :onchange="(e) => setLocalStorageValue('location', e.target.value)"
          >
            <option
              v-for="country in countryInformations"
              :key="country.value"
              :value="country.value"
            >
              {{ country.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Bottom block with gray background -->
      <div class="bg-gray-50 mt-10">
        <div class="mx-5 md:mx-0 px-5 md:px-20">
          <!-- Packages -->
          <div class="pt-5 md:pt-10"></div>
          <div
            class="my-2 flex flex-col md:text-lg"
            v-for="pkg in packages"
            :key="pkg.value"
          >
            <label>
              <input
                v-model="form.pkg"
                type="radio"
                name="package"
                :value="pkg.value"
                @change="
                  ($event) => setLocalStorageValue('pkg', $event.target.value)
                "
              />
              {{
                pkg.label
                  .replace(
                    "__additionalPrice__",
                    `+${additionalPrice(pkg.value)}`
                  )
                  .replace("__currency__", selectedCurrency)
              }}
            </label>
          </div>

          <!-- Total price -->
          <div class="mt-10 text-center">
            <p id="premium-price" class="text-2xl md:text-3xl">
              Your premium is
              {{ totalPrice }}
              {{ selectedCurrency }}
            </p>
          </div>

          <!-- Back/Next Buttons -->
          <div class="flex space-x-4 text-center pb-10">
            <div
              class="mt-10 mx-auto py-2 w-2/3 text-black text-lg md:text-2xl bg-white rounded-lg cursor-pointer"
            >
              <router-link class="block" to="/step-1"> Back </router-link>
            </div>

            <div
              class="mt-10 mx-auto py-2 w-2/3 text-white text-lg md:text-2xl bg-black border-2 border-gray-200 rounded-lg cursor-pointer text-center"
            >
              <router-link
                class="block"
                :to="form.age > 100 ? '/step-2/error' : '/step-3'"
              >
                Next
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <router-view></router-view>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, integer } from "@vuelidate/validators";

import SimpleInput from "../../components/Form/SimpleInput.vue";
import {
  COUNTRY_INFORMATIONS_CONSTANT,
  PACKAGE_CONSTANT,
  getLocalStorageValue,
  getPremiumPrice,
  getAdditionalPriceByPackage,
} from "../../common";

export default {
  name: "StepTwo",
  components: {
    SimpleInput,
  },
  data() {
    return {
      countryInformations: COUNTRY_INFORMATIONS_CONSTANT,
      packages: PACKAGE_CONSTANT,
      form: {
        name: "",
        age: 0,
        location: 0,
        pkg: 0,
      },
    };
  },
  validations() {
    return {
      form: {
        name: { required },
        age: { required, integer },
      },
    };
  },
  computed: {
    selectedCurrency() {
      return (
        this.countryInformations.find((c) => c.value === this.form.location)
          ?.currency || ""
      );
    },
    totalPrice() {
      return this.premiumPrice() + this.additionalPrice(this.form.pkg) || 0;
    },
  },
  setup() {
    return { v$: useVuelidate() };
  },
  mounted() {
    for (const key of ["name", "age"]) {
      const localStorageData = getLocalStorageValue(key);
      if (localStorageData) {
        this.form[`${key}`] = +localStorageData
          ? +localStorageData
          : localStorageData;

        this.v$.form[`${key}`].$touch();
      }
    }
    const location = getLocalStorageValue("location");
    if (
      location &&
      COUNTRY_INFORMATIONS_CONSTANT.map((c) => c.value).includes(+location)
    ) {
      this.form.location = +location;
    }

    const pkg = getLocalStorageValue("pkg");
    if (pkg && PACKAGE_CONSTANT.map((c) => c.value).includes(+pkg)) {
      this.form.pkg = +pkg;
    }
  },
  methods: {
    setLocalStorageValue(key, value) {
      localStorage.setItem(key, value);
    },

    premiumPrice() {
      return getPremiumPrice(this.form.age, this.form.location);
    },

    additionalPrice(pkgValue) {
      return getAdditionalPriceByPackage(this.premiumPrice(), pkgValue);
    },
  },
};
</script>

<style></style>
