export interface ICarrera{
  name:string,
  planEstudio: IPlanEstudio[]
}

export interface IPlanEstudio {
  year:number,
  materias:string[]
}

export interface INewPlanEstudio{
  year:number,
  materia:string
}

export interface INewCarrera{
  carrera:string,
  materias:INewPlanEstudio[]
}
