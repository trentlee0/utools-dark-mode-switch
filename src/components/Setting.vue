<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <span>设置</span>
      </div>
    </template>
    <el-form label-width="100px" style="max-width: 460px">
      <el-form-item label="自动切换">
        <el-select
            v-model="autoMode"
            @change="autoModeChange"
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
            <el-switch @change="forceSwitchChange" v-model="isForceSwitch"/>
          </el-tooltip>
        </el-form-item>
      </div>
      <div v-if="isCustomMode">
        <el-form-item label="浅色模式">
          <el-time-picker
              @visible-change="lightTimeChange"
              v-model="lightTime"
              :clearable="false"
              placeholder="时间"
              format="HH:mm"
          />
        </el-form-item>
        <el-form-item label="深色模式">
          <el-time-picker
              @visible-change="darkTimeChange"
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
              v-model="latitude"
              @blur="coordinateChange"
              placeholder="度数"
          />
        </el-form-item>
        <el-form-item label="经度">
          <el-input
              v-model="longitude"
              @blur="coordinateChange"
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
import {Status} from '@/store'
import {formatTime, parseTimeToDate} from '@/util/common'
import {ref, watchEffect, computed} from 'vue'
import {useStore, Coordinate} from '@/store'
import {getSunrise, getSunset} from '@/util/suntime'

const store = useStore()

const lightTime = ref(new Date())
const darkTime = ref(new Date())
const isForceSwitch = ref(false)

const autoMode = ref<string>('经纬度')
const options = ['关闭', '自定义时间', '经纬度']

const latitude = ref(39.9)
const longitude = ref(116.3)

const isDisable = computed(() => autoMode.value === '关闭')
const isCustomMode = computed(() => autoMode.value === '自定义时间')
const isCoordinateMode = computed(() => autoMode.value === '经纬度')
const sunriseTime = computed(() => getSunrise(latitude.value, longitude.value))
const sunsetTime = computed(() => getSunset(latitude.value, longitude.value))

const map = new Map<Status, string>()
map.set(Status.DISABLE, '关闭')
map.set(Status.AUTO_TIME, '自定义时间')
map.set(Status.COORDINATE, '经纬度')

const reverseMap = new Map<string, Status>()
reverseMap.set('关闭', Status.DISABLE)
reverseMap.set('自定义时间', Status.AUTO_TIME)
reverseMap.set('经纬度', Status.COORDINATE)

watchEffect(() => {
  lightTime.value = parseTimeToDate(store.toLightTime)
  darkTime.value = parseTimeToDate(store.toDarkTime)
  isForceSwitch.value = store.forceSwitch
  autoMode.value = map.get(store.status) ?? '关闭'
})

function autoModeChange() {
  store.setStatus(reverseMap.get(autoMode.value) ?? Status.DISABLE)
}

function forceSwitchChange() {
  store.setForceSwitch(isForceSwitch.value)
}

function coordinateChange() {
  store.setCoordinate(Coordinate.build(latitude.value, longitude.value))
}

function lightTimeChange(visibility: boolean) {
  if (visibility) return
  store.setToLightTime(formatTime(lightTime.value))
}

function darkTimeChange(visibility: boolean) {
  if (visibility) return
  store.setToDarkTime(formatTime(darkTime.value))
}
</script>

<style lang="scss" scoped></style>
