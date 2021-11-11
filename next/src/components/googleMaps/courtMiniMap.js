// Map Imports
/* eslint-disable no-undef */
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'

const GOOGLE_MAPS_API_KEY = 'AIzaSyB0y4bi5X2uc_EZGF8yE-GIc_09jd9rwRg'

export default {
    name: "CourtMiniMap",
    props: ['courtObj'],

    setup(props) {

        console.log(`props below, from courtMiniMap.js`)
        console.log(props)
        console.log(props.courtObj.location.lat)
        console.log(props.courtObj.location.lng)
        
        const currPos = computed(() => ({
          lat: props.courtObj.location.lat,
          lng: props.courtObj.location.lng,
        }))
        const otherPos = ref(null)
    
        const loader = new Loader({apiKey: GOOGLE_MAPS_API_KEY})
        const mapDiv = ref(null)
        let map = ref(null)
        let clickListener = null
    
        onMounted( async () => {
          await loader.load()
          map.value = new google.maps.Map(mapDiv.value, {
            center: currPos.value,
            zoom: 15,
          })

          let contentString = `<p>${props.courtObj.vicinity} <br/><br/> ${props.courtObj.name}<p>`

          const infoWindow = new google.maps.InfoWindow({
            content: contentString
          })  
    
          const marker = new google.maps.Marker({
            position: currPos.value,
            map: map.value,
            icon: '',
          })
    
          marker.addListener('click', () => {
            infoWindow.open({
              anchor: marker,
              map,
              shouldFocus: true,
            })
          })
    
          // var currPosMarker = new google.maps.Marker ({
          //   position: currPos.value,
          //   map: map.value,
          //   icon: ''
          // })
    
          // map.value.addListener(
          //   'click',
          //   ({ latLng: { lat, lng }}) => {  
          //     otherPos.value = { lat: lat(), lng: lng() }
          //     currPosMarker.setMap(null)
          //   }
          // )


        })
        onUnmounted( async () => {
          if (clickListener) clickListener.remove()
        })
    
        return { currPos, otherPos, mapDiv }
    },

}