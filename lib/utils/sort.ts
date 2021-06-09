// CONFIGURACIÓN
const BAR_MARGIN: number = 10
const BAR_WIDTH: number = 5
const BAR_HEIGHT: number = 300
let VELOCITY: number = 200

// GLOBALES
let globalSortData: number[] = [
	4, 1, 13, 2, 15, 3, 8, 9, 5, 11, 14, 6, 18, 12, 7,
]
let globalCopySortData: number[] = [...globalSortData]
let globalSortLength: number = globalSortData.length
let sortBarWidth: number = (BAR_WIDTH / globalSortLength) * 100
let maxSortDataValue: number = Math.max(...globalSortData)
let sortBarHeight: number = BAR_HEIGHT / Math.max(0.5, maxSortDataValue)
let fontSize: number = 20

// ELEMENTOS
const codeDataArray = document.getElementById('code-data-array')
const sortStepText = document.getElementById('sort-step-text')
const sortRuntime = document.getElementById('sort-runtime')
const sortPerformance = document.getElementById('sort-performance')
const sortLengthText = document.getElementById('sort-length')
const sortBanner = document.getElementById('sort-banner')
const startButton = document.getElementById('start-btn')

// METODO DE SORT
let sortMethod: (
	data: number[],
	stepCallback?: (newSortData: number[], step: number) => unknown,
) => unknown = () => null

// COLORES
const barColors: string[] = [
	'#F44336',
	'#E91E63',
	'#9C27B0',
	'#673AB7',
	'#3F51B5',
	'#2196F3',
	'#009688',
	'#4CAF50',
	'#CDDC39',
	'#FFC107',
	'#FF5722',
]

// CARDAR JSON
const onChangeSortLoad = (ev: Event): void => {
	// INPUT
	const input = ev.target as HTMLInputElement
	const file = input.files ? input.files[0] : null

	// READER
	const reader = new FileReader()
	reader.onload = () => {
		const text = reader.result
		const json = JSON.parse(
			typeof text === 'string' ? text : '{}',
		) as JSONSortFile

		// ASIGNAR VARIABLES GLOBALES
		globalCopySortData = json.data
		globalSortData = json.data
		globalSortLength = json.data.length
		sortBarWidth = (BAR_WIDTH / json.data.length) * 100
		maxSortDataValue = Math.max(...json.data)
		sortBarHeight = BAR_HEIGHT / Math.max(0.5, maxSortDataValue)

		// TAMAÑOS DE FUENTE
		if (globalSortLength > 0 && globalSortLength <= 10) fontSize = 25
		else if (globalSortLength > 15 && globalSortLength <= 30) fontSize = 17
		else if (globalSortLength > 30 && globalSortLength <= 50) fontSize = 13
		else fontSize = 10

		// CAMBIAR MUESTRA DE CÓDIGO
		if (sortLengthText) sortLengthText.textContent = globalSortLength.toString()
		if (codeDataArray) codeDataArray.textContent = json.data.join(', ')
		if (sortStepText) sortStepText.textContent = '0'
		if (sortPerformance) sortPerformance.textContent = '0%'

		// ESTILOS Y TEXTOS
		removeBanner()
		setSortRuntime()
	}

	// LEER
	if (file) reader.readAsText(file)
}

// CALLBACK PARA DIBUJAR
drawInCanvas = () => {
	if (canvasCtx) {
		// LIMPIAR
		canvasCtx.clearRect(0, 0, width, height)

		// DIBUJAR BARRAS
		for (let barIndex: number = 0; barIndex < globalSortLength; barIndex++) {
			// COLOR
			canvasCtx.fillStyle =
				barColors[
					barIndex > barColors.length - 1
						? barIndex -
						  barColors.length * Math.floor(barIndex / barColors.length)
						: barIndex
				]

			// BARRA
			const rectX: number =
				sortBarWidth * barIndex + BAR_MARGIN * (barIndex + 1) - width / 2 + 20
			const rectY: number = -(sortBarHeight * globalSortData[barIndex]) + 138
			const rectH: number = sortBarHeight * globalSortData[barIndex]

			canvasCtx.fillRect(rectX, rectY, sortBarWidth, rectH)

			// TEXTO
			canvasCtx.fillStyle = '#fff'
			canvasCtx.font = `bold ${fontSize}px Montserrat`
			canvasCtx.textAlign = 'center'
			canvasCtx.textBaseline = 'middle'
			canvasCtx.fillText(
				globalSortData[barIndex].toString(),
				rectX + sortBarWidth / 2,
				160,
			)
		}
	}
}

// INICIAR ORDENAMIENTO
const startSorting = () => {
	// ORDENAMIENTO
	sortMethod(globalSortData, (newSortData: number[], step: number) => {
		// COPIAR DATOS
		let tmpSortData = [...newSortData]

		// ANIMAR
		setTimeout(() => {
			globalSortData = tmpSortData
			if (sortStepText) sortStepText.textContent = step.toString()
			if (sortPerformance)
				sortPerformance.textContent = `${(
					(globalSortLength / step) *
					100
				).toFixed(2)}%`
		}, step * VELOCITY)
	})
}

// TIEMPO DE EJECUCION
const setSortRuntime = () => {
	// CALCULAR TIEMPO
	const t0 = performance.now()
	sortMethod(globalSortData)
	const tf = performance.now()

	// MOSTRAR
	if (sortRuntime) sortRuntime.textContent = `${(tf - t0).toFixed(3)}ms`
}

// REINICIAR DATOS
const restartSortedData = () => {
	resetCanvas()
	globalSortData = globalCopySortData
}

// CAMBIAR VELOCIDAD
const onChangeSortVelocity = (ev: Event) => {
	const target = ev.target as HTMLInputElement
	VELOCITY = 850 - +target.value
}

// ELIMINAR IMAGEN DE BANNER
const removeBanner = () => {
	if (startButton && sortBanner) {
		setTimeout(() => {
			const btnRect = startButton.getBoundingClientRect().bottom
			const bannerRect = sortBanner.getBoundingClientRect().top + 24

			if (btnRect - bannerRect > 20) sortBanner.style.display = 'none'
		}, 100)
	}
}

// INICIAR A ORDENAR
removeBanner()
setSortRuntime()
