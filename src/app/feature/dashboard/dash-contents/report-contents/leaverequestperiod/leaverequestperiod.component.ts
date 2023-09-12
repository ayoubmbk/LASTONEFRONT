import { ChartDataModel } from './../../../model/chartData';
import { adata } from './../../../../../shared/data';
import { Component } from '@angular/core';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-leaverequestperiod',
  templateUrl: './leaverequestperiod.component.html',
  styleUrls: ['./leaverequestperiod.component.css']
})
export class LeaverequestperiodComponent {

  adata: any[];
  leaveData: any[];

  ngxData: ChartDataModel = {
    data: [
      {
        name: 'leaveTypeName',
        series: []
      }
    ]
  };

  view: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Leave Type';
  showYAxisLabel = true;
  yAxisLabel = 'Leave Request';
  legendTitle = 'Status';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };   

  constructor(private _reportService: ReportService) {
    Object.assign(this, { adata });
    this.retrieveLeaveReport();
  }


  retrieveLeaveReport() {
    this._reportService.getLeaveReport().subscribe(
      (res) => {
        this.leaveData = this.manipulateData(res);
        console.log(JSON.stringify(this.leaveData, null, 2));
      },
      (error) => {
        // Handle error
      }
    );
  }
  

  manipulateData(data) {

    const leaveTypeKeyHolder = [];
    const finalData = [];

    const helper = {};
    const result = data.reduce(function (r, o) {
      const key = o.leaveType + '-' + o.status;

      if (!helper[key]) {
        helper[key] = Object.assign({}, o); // create a copy of o
        r.push(helper[key]);
      } else {
        helper[key].count += o.count;
      }

      return r;
    }, []);

    result.forEach(function (item) {

      leaveTypeKeyHolder[item.leaveType] = leaveTypeKeyHolder[item.leaveType] || {};

      const newObj = leaveTypeKeyHolder[item.leaveType];

      if (Object.keys(newObj).length === 0) {
        finalData.push(newObj);
      }
      newObj['name'] = item.leaveType;

      newObj.series = newObj.series || [];

      newObj.series.push({ name: item.status, value: item.count });

    });

    return finalData;
  }

  onSelect(event) {
    console.log(event);
  }

}
