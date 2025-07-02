// mapComponent.ts
export function addMapComponent(editor) {
  // Remove default map block and component
  editor.Blocks.remove('map')
  editor.DomComponents.removeType('map')

  // Adding of a block for the map
  const blockManager = editor.BlockManager
  blockManager.add('map', {
    label: 'Map',
    category: 'Components',
    media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20.5,3L20.34,3.03L15,5.1L9,3L3.36,4.9C3.15,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21L3.66,20.97L9,18.9L15,21L20.64,19.1C20.85,19.03 21,18.85 21,18.62V3.5A0.5,0.5 0 0,0 20.5,3M10,5.47L14,6.87V18.53L10,17.13V5.47M5,6.46L8,5.45V17.15L5,18.31V6.46M19,17.54L16,18.55V6.86L19,5.7V17.54Z" /></svg>',
    content: {
      type: 'map',
      tagName: 'iframe',
      attributes: {
        frameborder: '0',
        scrolling: 'no',
        title: 'Map',
        'data-lat': '44.36451374951471',
        'data-lng': '4.155364036560059',
        'data-zoom': '12',
        'data-address': 'Musée du Louvre, Paris',
      },
      style: {
        width: '100%',
        height: '350px',
      },
      traits: [
        {
          type: 'text',
          name: 'address',
          label: 'Address',
          changeProp: true,
          value: 'Musée du Louvre, Paris',
        },
        {
          type: 'number',
          name: 'zoom',
          label: 'Zoom',
          changeProp: true,
          min: 3,
          max: 19,
          value: 12,
        },
      ],
    },
    select: true,
  })

  // Define the map component
  editor.DomComponents.addType('map', {
    model: {
      defaults: {
        type: 'map',
        tagName: 'iframe',
        attributes: {
          frameborder: '0',
          scrolling: 'no',
          title: 'Map',
          'data-lat': '44.36451374951471',
          'data-lng': '4.155364036560059',
          'data-zoom': '12',
          'data-address': 'Musée du Louvre, Paris',
        },
        style: {
          width: '100%',
          height: '350px',
        },
        address: 'Musée du Louvre, Paris',
        lat: '44.36451374951471',
        lng: '4.155364036560059',
        zoom: '12',
      },
      init() {
        this.on('change:address change:zoom change:mapType', this.updateIframe)
        this.updateIframe()
      },
      async updateIframe() {
        let lat = this.get('lat') || '44.36451374951471'
        let lng = this.get('lng') || '4.155364036560059'
        const zoom = this.get('zoom') || '12'
        const address = this.get('address') || 'Musée du Louvre, Paris'
        const mapType = this.get('mapType') || 'roadmap'

        // Using API nominatim to translate the address to a latitude and longitude
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
            {
              headers: {
                'User-Agent': 'Silex labs',
              },
            }
          )
          const data = await response.json()
          if (data && data.length > 0) {
            lat = data[0].lat
            lng = data[0].lon
            this.set({ lat, lng }) // Update the properties of the model
          } else {
            console.warn('Localisation not found')
          }
        } catch (error) {
          console.error('Error in the geocoding', error)
        }

        // Calculate a delta based on the zoom
        const zoomFactor = Math.max(3, parseInt(zoom))
        const delta = 180 / Math.pow(2, zoomFactor * 0.8)

        // Calculation of the bbox
        const minLng = Math.max(-180, parseFloat(lng) - delta)
        const minLat = Math.max(-90, parseFloat(lat) - delta)
        const maxLng = Math.min(180, parseFloat(lng) + delta)
        const maxLat = Math.min(90, parseFloat(lat) + delta)
        const bbox = `${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}`

        // Update the properties of the iframe
        this.setAttributes({
          frameborder: '0',
          scrolling: 'no',
          title: 'Carte OpenStreetMap',
          src: `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=hot&marker=${lat}%2C${lng}&zoom=${zoomFactor}&t=${Date.now()}`,
          'data-lat': lat,
          'data-lng': lng,
          'data-zoom': zoom,
          'data-address': address,
        })
      },
    },
  })
}