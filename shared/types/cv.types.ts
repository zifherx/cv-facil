interface IPromiseParam {
  cvId: string
}

export type PARAMS_CV_ROUTE = {
  params: Promise<IPromiseParam>
}

interface IPromiseSectionParam extends IPromiseParam {
  sectionId: string
}

export type PARAMS_CV_SECTION_ROUTE = {
  params: Promise<IPromiseSectionParam>
}
