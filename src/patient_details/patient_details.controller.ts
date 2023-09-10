import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PatientDetailsService } from './patient_details.service';
import { CreatePatientDetailDto } from './dto/create-patient_detail.dto';
import { UpdatePatientDetailDto } from './dto/update-patient_detail.dto';

@Controller('patient-details')
export class PatientDetailsController {
  constructor(private readonly patientDetailsService: PatientDetailsService) {}

  @Post()
  create(@Body() createPatientDetailDto: CreatePatientDetailDto) {
    return this.patientDetailsService.create(createPatientDetailDto);
  }

  @Get()
  findAll() {
    return this.patientDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDetailDto: UpdatePatientDetailDto) {
    return this.patientDetailsService.update(+id, updatePatientDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientDetailsService.remove(+id);
  }
}
