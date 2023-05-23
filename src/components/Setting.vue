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
          <el-option v-for="item in options" :key="item" :value="item" />
        </el-select>
      </el-form-item>
      <div v-if="!isDisable">
        <el-form-item label="强制切换">
          <el-tooltip placement="right" :show-after="600">
            <template #content>
              开启后，每 15 秒检查；否则，仅在每次启动时检查。
            </template>
            <el-switch
              @change="handleForceSwitchChange"
              v-model="isForceSwitch"
            />
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
            placeholder="纬度数"
          />
        </el-form-item>
        <el-form-item label="经度">
          <el-input
            v-model.number="longitude"
            @blur="handleCoordinateChange"
            placeholder="经度数"
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
import { formatTime, parseTime } from '@/utils/common'
import { ref, computed, reactive } from 'vue'
import { useStore } from '@/store'
import { Status } from '@/constant'
import { CoordinateModel } from '@/models/CoordinateModel'
import { getSunrise, getSunset } from '@/utils/suntime'

const store = useStore()

const options = reactive([
  Status.desc(Status.DISABLE),
  Status.desc(Status.AUTO_TIME),
  Status.desc(Status.COORDINATE)
])

const lightTime = ref(parseTime(store.toLightTime))
const darkTime = ref(parseTime(store.toDarkTime))
const isForceSwitch = ref(store.forceSwitch)
const switchMode = ref(Status.desc(store.status))
const latitude = ref(store.coordinate.latitude)
const longitude = ref(store.coordinate.longitude)

const isDisable = computed(
  () => Status.val(switchMode.value) === Status.DISABLE
)
const isCustomMode = computed(
  () => Status.val(switchMode.value) === Status.AUTO_TIME
)
const isCoordinateMode = computed(
  () => Status.val(switchMode.value) === Status.COORDINATE
)

const sunriseTime = computed(() => getSunrise(latitude.value, longitude.value))
const sunsetTime = computed(() => getSunset(latitude.value, longitude.value))

function handleSwitchModeChange() {
  store.setStatus(Status.val(switchMode.value) ?? Status.DISABLE)
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

<style lang="css" scoped>
.box-card {
  border: none;
}
</style>
