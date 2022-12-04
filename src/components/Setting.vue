<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h4>设置</h4>
      </div>
    </template>
    <el-form label-width="100px" style="max-width: 460px">
      <el-form-item label="自动切换">
        <el-select
            v-model="switchMode"
            @change="handleSwitchModeChange"
            class="m-2"
            placeholder="Select"
        >
          <el-option v-for="item in options" :key="item" :value="item"/>
        </el-select>
      </el-form-item>
      <div v-if="!isDisable">
        <el-form-item label="强制切换">
          <el-tooltip placement="right" :show-after="600">
            <template #content>开启后，每 15 秒检查；否则，仅在每次启动时检查。</template>
            <el-switch @change="handleForceSwitchChange" v-model="isForceSwitch"/>
          </el-tooltip>
        </el-form-item>
      </div>
      <div v-if="isCustomMode">
        <el-form-item label="浅色模式">
          <el-time-picker
              @visible-change="handleLightTimeChange"
              v-model="lightTime"
              :clearable="false"
              placeholder="时间"
              format="HH:mm"
          />
        </el-form-item>
        <el-form-item label="深色模式">
          <el-time-picker
              @visible-change="handleDarkTimeChange"
              v-model="darkTime"
              :clearable="false"
              format="HH:mm"
              placeholder="时间"
          />
        </el-form-item>
      </div>
      <div v-else-if="isCoordinateMode">
        <el-form-item label="纬度">
          <el-input
              v-model.number="latitude"
              @blur="handleCoordinateChange"
              placeholder="度数"
          />
        </el-form-item>
        <el-form-item label="经度">
          <el-input
              v-model.number="longitude"
              @blur="handleCoordinateChange"
              placeholder="度数"
          />
        </el-form-item>
        <el-form-item label="日出">
          <span>{{ sunriseTime }}</span>
        </el-form-item>
        <el-form-item label="日落">
          <span>{{ sunsetTime }}</span>
        </el-form-item>
      </div>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import {formatTime, parseTimeToDate} from '@/util/common'
import {getStatusConverter} from '@/constant/status'
import {ref, onMounted, computed} from 'vue'
import {useStore} from '@/store'
import {Status} from '@/constant'
import {CoordinateModel} from '@/models/CoordinateModel'
import {getSunrise, getSunset} from '@/util/suntime'


const store = useStore()

const statusConverter = getStatusConverter()
const options = statusConverter.getLocaleStatuses()
const isDisable = computed(() => statusConverter.localeToStatus(switchMode.value) === Status.DISABLE)
const isCustomMode = computed(() => statusConverter.localeToStatus(switchMode.value) === Status.AUTO_TIME)
const isCoordinateMode = computed(() => statusConverter.localeToStatus(switchMode.value) === Status.COORDINATE)

const sunriseTime = computed(() => getSunrise(latitude.value, longitude.value))
const sunsetTime = computed(() => getSunset(latitude.value, longitude.value))

const lightTime = ref<Date>(new Date())
const darkTime = ref<Date>(new Date())
const isForceSwitch = ref<boolean>(false)
const switchMode = ref<string>('')
const latitude = ref(CoordinateModel.DEFAULT.latitude)
const longitude = ref(CoordinateModel.DEFAULT.longitude)
onMounted(() => {
  lightTime.value = parseTimeToDate(store.setting.toLightTime)
  darkTime.value = parseTimeToDate(store.setting.toDarkTime)
  isForceSwitch.value = store.setting.forceSwitch
  switchMode.value = statusConverter.statusToLocale(store.setting.status)
  latitude.value = store.setting.coordinate.latitude
  longitude.value = store.setting.coordinate.longitude
})

function handleSwitchModeChange() {
  store.setStatus(statusConverter.localeToStatus(switchMode.value))
}

function handleForceSwitchChange() {
  store.setForceSwitch(isForceSwitch.value)
}

function handleCoordinateChange() {
  store.setCoordinate(new CoordinateModel(latitude.value, longitude.value))
}

function handleLightTimeChange(visibility: boolean) {
  if (visibility) return
  store.setToLightTime(formatTime(lightTime.value))
}

function handleDarkTimeChange(visibility: boolean) {
  if (visibility) return
  store.setToDarkTime(formatTime(darkTime.value))
}
</script>

<style lang="scss" scoped>
.box-card {
  border: none;
}
</style>
