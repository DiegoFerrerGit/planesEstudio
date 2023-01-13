import { Component, OnInit } from '@angular/core';
import { PlanesFunctions } from './planes.functions';
import { ICarrera, INewCarrera, INewPlanEstudio } from './interfaces/planes.interfaces';
import carrera1 from '../../assets/planes/ingenieria_software.json';
import carrera2 from '../../assets/planes/licenciatura_informatica.json'
import carrera3 from '../../assets/planes/licenciatura_IA.json'
import carrera4 from '../../assets/planes/seguridad_informatica.json'
import stringSimilarity from 'string-similarity';



@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.scss']
})
export class PlanesComponent implements OnInit {

  optionsDefault:ICarrera[] = []

  selectOptions1:ICarrera[] = []
  selectOptions2:ICarrera[] = []

  selectedCarrera1!:ICarrera
  selectedCarrera2!:ICarrera

  showPlan:boolean = false

  newCarrera1!:INewCarrera
  newCarrera2!:INewCarrera

  materiasEnComun!:INewPlanEstudio[]

  carrera1DiferenciaView!:string[][]
  carrera2DiferenciaView!:string[][]

  carrera1Titles:number[] = []
  carrera2Titles:number[] = []

  totalMaterias1:number = 0
  totalMaterias2:number = 0
  countCarrera1:number = 0
  countCarrera2:number = 0

  constructor(
    private planesFunctions:PlanesFunctions
    ) {}

  ngOnInit(): void {
    this.optionsDefault.push(carrera1)
    this.optionsDefault.push(carrera2)
    this.optionsDefault.push(carrera3)
    this.optionsDefault.push(carrera4)
    this.selectOptions1 = this.optionsDefault
    this.selectOptions2 = this.optionsDefault
  }

  getCarrera1(event:ICarrera):void{
    this.selectedCarrera1 = event
    this.selectOptions2 = this.optionsDefault
    this.selectOptions2 = this.selectOptions2.filter(option => option !== event)
  }

  getCarrera2(event:ICarrera):void{
    this.selectedCarrera2 = event
    this.selectOptions1 = this.optionsDefault
    this.selectOptions1 = this.selectOptions1.filter(option => option !== event)
  }

  async getPlans():Promise<void> {
    this.transformPlans()
  }

  async transformPlans(){
    const carrera1 = await this.transformPlanEstudio(this.selectedCarrera1)
    const carrera2 = await this.transformPlanEstudio(this.selectedCarrera2)

    this.newCarrera1 = this.formatRoman(carrera1)
    this.newCarrera2 = this.formatRoman(carrera2)
    this.comparePlans(this.newCarrera1,this.newCarrera2)
  }

  async transformPlanEstudio(plan:ICarrera):Promise<INewCarrera>{

    const initial:INewPlanEstudio[] = []

    return {
        carrera: this.planesFunctions.removeAccents(plan.name),
        materias: plan.planEstudio.reduce((accumulator,current) => {
            let temporal = []
            for (const materia of current.materias) {
                const newMateria = {
                    year: current.year,
                    materia: this.planesFunctions.removeAccents(materia)
                }
                temporal.push(newMateria)
            }
            accumulator = [...accumulator,...temporal]
            return accumulator
        },initial)
    }
  }

  formatRoman(carreraData:INewCarrera):INewCarrera{
    const materias = carreraData.materias.map(materia => {
      return {
        year:materia.year,
        materia:this.planesFunctions.transformStringRoman(materia.materia)
      }
    })
    return {
      carrera:carreraData.carrera,
      materias
    }
  }

  comparePlans(plan1:INewCarrera,plan2:INewCarrera):void{
    // Materias en comun
    const materiasComun =  plan1.materias.filter(carrera1 => {
      return plan2.materias.some(carrera2 => {

        const materia1 = carrera1.materia.toUpperCase()
        const materia2= carrera2.materia.toUpperCase()

        const similarity = stringSimilarity.compareTwoStrings(materia1, materia2);
        const length = this.planesFunctions.negativeToPositive(materia1.length - materia2.length)
        const coindicende = length >= 0 && length <= 2

        if(similarity > 0.8 && coindicende){
          return similarity > 0.8 ? true : false
        }
        return false
      })
    })
    this.materiasEnComun = materiasComun

    // Carrera 1
    const diferenciaCarrera1 = plan1.materias.filter(carrera1 => {
      return plan2.materias.every(carrera2 => {
        const materia1 = carrera1.materia.toUpperCase()
        const materia2= carrera2.materia.toUpperCase()

        const similarity = stringSimilarity.compareTwoStrings(materia1, materia2);
        const length = this.planesFunctions.negativeToPositive(materia1.length - materia2.length)
        const coindicende = length >= 0 && length <= 2

        if(similarity > 0.8 && coindicende){
          return similarity > 0.8 ? false : true
        }
        return true
      })
    })

    this.totalMaterias1 = plan1.materias.length
    this.countCarrera1 = diferenciaCarrera1.length

    const yearsCarrera1 = diferenciaCarrera1.reduce((accumulator,current) => {
      if(accumulator.includes(0)){
        accumulator = [current.year]
      }
      if(!accumulator.includes(current.year)){
        accumulator = [...accumulator,current.year]
      }
      return accumulator
    },[0])
    const carrera1ForView = yearsCarrera1.map(year => {
      const materias = diferenciaCarrera1.filter(materia => materia.year === year).map(element => element.materia)
      return materias
    });
    this.carrera1DiferenciaView = carrera1ForView

    // Carrera2
    const diferenciaCarrera2 = plan2.materias.filter(carrera2 => {
      return plan1.materias.every(carrera1 => {
        const materia1 = carrera1.materia.toUpperCase()
        const materia2= carrera2.materia.toUpperCase()

        const similarity = stringSimilarity.compareTwoStrings(materia1, materia2);
        const length = this.planesFunctions.negativeToPositive(materia1.length - materia2.length)
        const coindicende = length >= 0 && length <= 2

        if(similarity > 0.8 && coindicende){
          return similarity > 0.8 ? false : true
        }
        return true
      })
    })
    this.totalMaterias2 = plan2.materias.length
    this.countCarrera2 = diferenciaCarrera2.length
    const yearsCarrera2 = diferenciaCarrera2.reduce((accumulator,current) => {
      if(accumulator.includes(0)){
        accumulator = [current.year]
      }
      if(!accumulator.includes(current.year)){
        accumulator = [...accumulator,current.year]
      }
      return accumulator
    },[0])
    const carrera2ForView = yearsCarrera2.map(year => {
      const materias = diferenciaCarrera2.filter(materia => materia.year === year).map(element => element.materia)
      return materias
    });
    this.carrera2DiferenciaView = carrera2ForView

    this.showPlan = true
  }



}
