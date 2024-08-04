class ReportDataAdapter {
  private reportData: { [key: string]: any } = {};

  setReportData(companyId: string, data: any) {
    this.reportData[companyId] = data;
  }

  getReportData(companyId: string) {
    return this.reportData[companyId];
  }
}

export default new ReportDataAdapter();
