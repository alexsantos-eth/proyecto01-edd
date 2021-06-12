// GLOBAL
let linearStructure: LinearStructure | null = null
let linearStructureLength: number = 0
let isCircular: boolean = false
let isSimple: boolean = true
let className:string = 'ListaSimple'

// TIPOS
type InsertMode = 'start' | 'end' | 'order'

// CONFIGURACIÓN GLOBAL
let insertMode: InsertMode = 'start'
let repeatValues: boolean = true
let newNodeValue: string = ''
let oldNodeValue: string = ''
canvasBannerDif = 110

// ELEMENTOS
const editor = document.querySelector('.editor > pre > code')
const navBtns = document.querySelectorAll('.nav-btn')

// DATOS INICIALES
const setLinearStructure = (
	newLinearStructure: LinearStructure | null,
	linearClassName: string,
	isSimpleLinear: boolean,
	isCircularLinear: boolean = false,
) => {
	linearStructure = newLinearStructure
	isSimple = isSimpleLinear
	className =linearClassName
	isCircular = isCircularLinear

	if (linearStructure) {
		linearStructure.insertar(1)
		linearStructure.insertar(2)
		linearStructure.insertar(3)
		linearStructure.insertar(4)
		linearStructure.insertar(5)
	}
	linearStructureLength = linearStructure?.getTamaño() || 5
}

// DIBUJAR
CanvasRenderingContext2D.prototype.arrow = function (
	x: number,
	y: number,
	distance: number,
	width?: number,
	down?: boolean,
	left?: boolean,
	double?: boolean,
) {
	// FLECHA
	const lineWidth = width || 4
	this.lineWidth = lineWidth

	// CURVA
	this.moveTo(x, y)
	this.quadraticCurveTo(
		x + distance / 2,
		y + (distance / 2) * (down ? 1 : -1),
		x + distance,
		y,
	)
	this.strokeStyle = this.fillStyle
	this.stroke()

	// TRIANGULO
	if (!left || double) {
		this.beginPath()
		this.lineWidth = 1

		if (!down) {
			this.moveTo(x + distance - 5, y + 5)
			this.lineTo(x + distance + 5, y - 5)
			this.lineTo(x + distance + 5, y + 5)
		} else {
			this.moveTo(x + distance + 5, y + 5)
			this.lineTo(x + distance - 5, y - 5)
			this.lineTo(x + distance + 5, y - 5)
		}

		this.stroke()
		this.fill()
		this.closePath()
	}

	if (left || double) {
		this.beginPath()
		this.lineWidth = 1
		if (!down) {
			this.moveTo(x - 5, y - 5)
			this.lineTo(x + 5, y + 5)
			this.lineTo(x - 5, y + 5)
		} else {
			this.moveTo(x - 5, y + 5)
			this.lineTo(x + 5, y - 5)
			this.lineTo(x - 5, y - 5)
		}

		this.stroke()
		this.fill()
		this.closePath()
	}
}

// LEER ARCHIVO
fileUploadCallback = (json: JSONInputFile) => {
	const { valores } = json

	// BORRAR
	if (linearStructure)
		for (
			let linearIndex: number = 0;
			linearIndex < linearStructureLength;
			linearIndex++
		)
			linearStructure.pop()

	// TEXTOS
	linearStructureLength = 0
	if (editor)
	// @ts-ignore
		editor.innerHTML = `<strong style="color:var(--ice)">const</strong> data <i style='color:var(--soda)'>=</i> <strong style='color:var(--soda)'>new</strong> <strong style="color:var(--ice)">${className}</strong><strong style="color:var(--gray)">&#x3c;</strong><strong style="color:var(--ice)">number</strong><strong style="color:var(--gray)">&#x3e;</strong>()\n`

	// ITERAR
	valores.forEach((valor: string | number) => {
		newNodeValue = valor.toString()
		addNode()
	})
}

// DIBUJAR
drawInCanvas = () => {
	if (canvasCtx) {
		canvasCtx.globalCompositeOperation = 'destination-over'
		for (let nodeIndex = 0; nodeIndex < linearStructureLength; nodeIndex++) {
			// POSICIONES
			const nodeX: number = -579 + 150 * nodeIndex

			// NODO FINAL LISTA CIRCULAR
			if (isCircular && nodeIndex === 0 && !isSimple) {
				const nodeEndX = -530 + 150 * -1

				canvasCtx.beginPath()
				canvasCtx.arc(nodeEndX, 0, 30, 0, 2 * Math.PI)

				// COLOR
				canvasCtx.save()
				canvasCtx.globalAlpha = 0.5
				canvasCtx.fillStyle = '#aaa'
				canvasCtx.strokeStyle =
					canvasObjectColors[
						linearStructureLength + 2 > canvasObjectColors.length - 1
							? linearStructureLength +
							  2 -
							  canvasObjectColors.length *
									Math.floor(linearStructureLength / canvasObjectColors.length)
							: linearStructureLength + 2
					]
				canvasCtx.lineWidth = 7
				canvasCtx.stroke()
				canvasCtx.fill()
				canvasCtx.closePath()

				// TEXTO
				const nodeEndValue = linearStructure
					? linearStructure.obtener(linearStructureLength - 1).valor.toString()
					: ''
				if (linearStructure) {
					canvasCtx.font = `bold ${20 - nodeEndValue.length * 0.5}px Montserrat`
					canvasCtx.textAlign = 'center'
					canvasCtx.fillText(nodeEndValue, nodeEndX, -50)
				}
				canvasCtx.restore()
			}

			// CIRCULO
			canvasCtx.beginPath()
			canvasCtx.arc(nodeX, 0, 40, 0, 2 * Math.PI)

			// COLOR
			canvasCtx.fillStyle = '#aaa'
			canvasCtx.strokeStyle =
				canvasObjectColors[
					nodeIndex > canvasObjectColors.length - 1
						? nodeIndex -
						  canvasObjectColors.length *
								Math.floor(nodeIndex / canvasObjectColors.length)
						: nodeIndex
				]
			canvasCtx.lineWidth = 7
			canvasCtx.stroke()
			canvasCtx.fill()
			canvasCtx.closePath()

			// TEXTO
			const nodeValue = linearStructure
				? linearStructure.obtener(nodeIndex).valor.toString()
				: ''
			if (linearStructure) {
				canvasCtx.font = `bold ${20 - nodeValue.length * 0.5}px Montserrat`
				canvasCtx.textAlign = 'center'
				canvasCtx.fillText(nodeValue, nodeX, -50)
			}

			// FLECHA NODO SIGUIENTE
			if (
				nodeIndex < linearStructureLength - 1 ||
				(isCircular && nodeIndex === linearStructureLength - 1)
			) {
				const isCircularEnd =
					isCircular && nodeIndex === linearStructureLength - 1
				canvasCtx.beginPath()

				if (isSimple || isCircular) {
					canvasCtx.save()

					if (isSimple) {
						canvasCtx.scale(2, 2)
						canvasCtx.translate(225, 0)
					}

					if (isCircularEnd) canvasCtx.globalAlpha = 0.5
				}

				canvasCtx.fillStyle = 'white'
				canvasCtx.arrow(
					(isSimple ? nodeX / 2 : nodeX) + 5 + (isSimple ? -215 : 0),
					-1,
					isSimple ? (isCircularEnd ? 36 : 60) : 95,
					4,
				)

				canvasCtx.closePath()
				if (isSimple || isCircular) canvasCtx.restore()
			}

			// NODO FINAL LISTA CIRCULAR
			if (isCircular && nodeIndex === linearStructureLength - 1) {
				// CIRCULO
				const nodeRootX = -625 + 150 * (nodeIndex + 1)
				canvasCtx.beginPath()
				canvasCtx.arc(nodeRootX, 0, 30, 0, 2 * Math.PI)

				// COLOR
				canvasCtx.save()
				canvasCtx.globalAlpha = 0.5
				canvasCtx.fillStyle = '#aaa'
				canvasCtx.strokeStyle =
					canvasObjectColors[
						nodeIndex + 1 > canvasObjectColors.length - 1
							? nodeIndex +
							  1 -
							  canvasObjectColors.length *
									Math.floor(nodeIndex / canvasObjectColors.length)
							: nodeIndex + 1
					]
				canvasCtx.lineWidth = 7
				canvasCtx.stroke()
				canvasCtx.fill()
				canvasCtx.closePath()

				// TEXTO
				const nodeRootValue = linearStructure
					? linearStructure.obtener(0).valor.toString()
					: ''
				if (linearStructure) {
					canvasCtx.font = `bold ${
						20 - nodeRootValue.length * 0.5
					}px Montserrat`
					canvasCtx.textAlign = 'center'
					canvasCtx.fillText(nodeRootValue, nodeRootX, -50)
				}

				canvasCtx.restore()
			}

			// FLECHA NODO ANTERIOR
			if (
				(nodeIndex > 0 && !isSimple) ||
				(isCircular && nodeIndex === 0 && !isSimple)
			) {
				if (!isSimple || isCircular) {
					canvasCtx.save()

					if (isCircular && nodeIndex === 0) {
						canvasCtx.globalAlpha = 0.5

						if (!isSimple) {
							canvasCtx.scale(0.8, 0.8)
							canvasCtx.translate(-170, 0)
						}
					}
				}

				canvasCtx.beginPath()
				canvasCtx.fillStyle = 'white'
				canvasCtx.arrow(nodeX + 5 - 105, -1, 95, 4, true, true)
				canvasCtx.closePath()

				if (!isSimple || isCircular) canvasCtx.restore()
			}
		}
	}
}

// GUARDAR VALORES DE NODOS
const saveNewNodeValue = (ev: Event) => {
	const target = ev.target as HTMLInputElement
	newNodeValue = target.value
}

const saveOldNodeValue = (ev: Event) => {
	const target = ev.target as HTMLInputElement
	oldNodeValue = target.value
}

// CAMBIAR OPCIÓN DE REPETIR VALORES
const changeRepeatValues = (ev: Event) => {
	const target = ev.target as HTMLInputElement
	repeatValues = target.checked
}

// CAMBIAR MODO PARA INSERTAR
const changeInsertMode = (ev: Event) => {
	const target = ev.target as HTMLInputElement
	insertMode = target.value as InsertMode
}

// AGREGAR CÓDIGO
const addTestCode = (method: string, value: string) => {
	if (editor)
		editor.innerHTML =
			editor.innerHTML +
			`\ndata.<strong style="color: var(--green)">${method}</strong>(<strong style="color: var(--lightPurple)">${value}</strong>)`
}

// AGREGAR NODO
const addNode = () => {
	if (linearStructure && newNodeValue.length > 0) {
		// BUSCAR NODO
		const nodeOnStructure: LinearNode | null =
			linearStructure.buscar(newNodeValue)

		// INSERTAR
		if (repeatValues || (!repeatValues && nodeOnStructure === null)) {
			if (insertMode === 'start') linearStructure.push(newNodeValue)
			else if (insertMode === 'end') linearStructure.insertar(newNodeValue)
			// RE DIMENSION
			linearStructureLength = linearStructure.getTamaño()

			// AGREGAR MUESTRA DE CÓDIGO
			addTestCode(
				insertMode === 'start'
					? 'push'
					: insertMode === 'end'
					? 'insertar'
					: 'insertar',
				newNodeValue,
			)

			// OCULTAR MENU
			hideNavMenu(1)
			removeBanner()
		}
	}
}

// ELIMINAR NODO
const removeNode = () => {
	if (linearStructure && oldNodeValue.length > 0) {
		// BUSCAR NODO
		const nodeOnStructure: LinearNode | null =
			linearStructure.buscar(oldNodeValue)

		if (nodeOnStructure !== null) {
			// ELIMINAR
			linearStructure.eliminar(oldNodeValue)

			// RE DIMENSION
			linearStructureLength = linearStructure.getTamaño()

			// AGREGAR MUESTRA DE CÓDIGO
			addTestCode('eliminar', oldNodeValue)

			// OCULTAR MENU
			hideNavMenu(1)
			removeBanner()
		}
	}
}

// ELIMINAR NODO
const findNode = () => {
	if (linearStructure && oldNodeValue.length > 0) {
		// BUSCAR NODO
		const nodeOnStructure: LinearNode | null =
			linearStructure.buscar(oldNodeValue)

		if (nodeOnStructure !== null) {
			// ELIMINAR
			linearStructure.buscar(oldNodeValue)

			// RE DIMENSION
			linearStructureLength = linearStructure.getTamaño()

			// AGREGAR MUESTRA DE CÓDIGO
			addTestCode('buscar', oldNodeValue)

			// OCULTAR MENU
			hideNavMenu(1)
			removeBanner()
		}
	}
}

// ELIMINAR NODO
const updateNode = () => {
	if (linearStructure && newNodeValue.length > 0 && oldNodeValue.length > 0) {
		// BUSCAR NODO
		const nodeOnStructure: LinearNode | null =
			linearStructure.buscar(oldNodeValue)
		const newNodeOnStructure: LinearNode | null =
			linearStructure.buscar(newNodeValue)

		if (
			nodeOnStructure !== null &&
			(repeatValues || (newNodeOnStructure === null && !repeatValues))
		) {
			// ELIMINAR
			linearStructure.actualizar(oldNodeValue, newNodeValue)

			// RE DIMENSION
			linearStructureLength = linearStructure.getTamaño()

			// AGREGAR MUESTRA DE CÓDIGO
			addTestCode('actualizar', `${oldNodeValue},${newNodeValue}`)

			// OCULTAR MENU
			hideNavMenu(1)
			removeBanner()
		}
	}
}

// EVENTOS DE ELEMENTOS
const inputsMenuSwitcher = Array.prototype.slice
	.call(navBtns)
	.map(
		(element: Element) =>
			element.previousElementSibling as HTMLInputElement | null,
	)
	.filter(Boolean) as HTMLInputElement[]

// OCULTAR TODOS
navBtns.forEach((navElement: Element, navIndex: number) =>
	navElement.addEventListener('click', () =>
		inputsMenuSwitcher.forEach(
			(inputElement: HTMLInputElement, inpIndex: number) => {
				if (navIndex !== inpIndex) inputElement.checked = false
			},
		),
	),
)

// OCULTAR MANUALMENTE
const hideNavMenu = (index: number) => {
	inputsMenuSwitcher.forEach(
		(inputElement: HTMLInputElement, inpIndex: number) => {
			if (index === inpIndex) inputElement.checked = false
		},
	)
}
