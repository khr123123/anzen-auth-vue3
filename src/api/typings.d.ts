declare namespace API {
  type BaseResponseBoolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseListLong = {
    code?: number;
    data?: number[];
    message?: string;
  };

  type BaseResponseListSysMenu = {
    code?: number;
    data?: SysMenu[];
    message?: string;
  };

  type BaseResponseListSysOperaLog = {
    code?: number;
    data?: SysOperaLog[];
    message?: string;
  };

  type BaseResponseListSysRole = {
    code?: number;
    data?: SysRole[];
    message?: string;
  };

  type BaseResponseListSysUser = {
    code?: number;
    data?: SysUser[];
    message?: string;
  };

  type BaseResponseLoginUserInfoVO = {
    code?: number;
    data?: LoginUserInfoVO;
    message?: string;
  };

  type BaseResponsePageSysMenu = {
    code?: number;
    data?: PageSysMenu;
    message?: string;
  };

  type BaseResponsePageSysOperaLog = {
    code?: number;
    data?: PageSysOperaLog;
    message?: string;
  };

  type BaseResponsePageSysRole = {
    code?: number;
    data?: PageSysRole;
    message?: string;
  };

  type BaseResponsePageSysUser = {
    code?: number;
    data?: PageSysUser;
    message?: string;
  };

  type BaseResponseServer = {
    code?: number;
    data?: Server;
    message?: string;
  };

  type BaseResponseSetLong = {
    code?: number;
    data?: number[];
    message?: string;
  };

  type BaseResponseString = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseSysMenu = {
    code?: number;
    data?: SysMenu;
    message?: string;
  };

  type BaseResponseSysOperaLog = {
    code?: number;
    data?: SysOperaLog;
    message?: string;
  };

  type BaseResponseSysRole = {
    code?: number;
    data?: SysRole;
    message?: string;
  };

  type BaseResponseSysUser = {
    code?: number;
    data?: SysUser;
    message?: string;
  };

  type CentralProcessor = {
    logicalProcessors?: LogicalProcessor[];
    processorCpuLoadTicks?: number[][];
    systemCpuLoadTicks?: number[];
    logicalProcessorCount?: number;
    processorIdentifier?: ProcessorIdentifier;
    physicalProcessorCount?: number;
    physicalPackageCount?: number;
    physicalProcessors?: PhysicalProcessor[];
    maxFreq?: number;
    contextSwitches?: number;
    featureFlags?: string[];
    interrupts?: number;
    currentFreq?: number[];
    processorCaches?: ProcessorCache[];
  };

  type Cpu = {
    cpuNum?: number;
    total?: number;
    sys?: number;
    used?: number;
    wait?: number;
    free?: number;
  };

  type deleteMenuParams = {
    id: number;
  };

  type deleteRoleParams = {
    id: number;
  };

  type deleteUserParams = {
    id: number;
  };

  type getLogInfoParams = {
    id: number;
  };

  type getMenuInfoParams = {
    id: number;
  };

  type getRoleInfoParams = {
    id: number;
  };

  type getRolePermissionParams = {
    id: number;
  };

  type getUserInfoParams = {
    id: number;
  };

  type getUserRolesParams = {
    id: number;
  };

  type GlobalMemory = {
    pageSize?: number;
    available?: number;
    total?: number;
    virtualMemory?: VirtualMemory;
    physicalMemory?: PhysicalMemory[];
  };

  type grantPermissionParams = {
    id: number;
    permissions?: number[];
  };

  type grantRoleParams = {
    id: number;
    roles?: number[];
  };

  type Jvm = {
    total?: number;
    max?: number;
    free?: number;
    version?: string;
    home?: string;
    name?: string;
    startTime?: string;
    usage?: number;
    used?: number;
    runTime?: string;
    inputArgs?: string;
  };

  type LogicalProcessor = {
    processorNumber?: number;
    physicalProcessorNumber?: number;
    physicalPackageNumber?: number;
    numaNode?: number;
    processorGroup?: number;
  };

  type LoginUserInfoVO = {
    user?: SysUser;
    permissions?: string[];
    roles?: string[];
  };

  type logPageParams = {
    page: PageSysOperaLog;
  };

  type Mem = {
    total?: number;
    used?: number;
    free?: number;
    usage?: number;
  };

  type pageMenuParams = {
    page: PageSysMenu;
  };

  type pageRoleParams = {
    page: PageSysRole;
  };

  type PageSysMenu = {
    records?: SysMenu[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
  };

  type PageSysOperaLog = {
    records?: SysOperaLog[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
  };

  type PageSysRole = {
    records?: SysRole[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
  };

  type PageSysUser = {
    records?: SysUser[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
  };

  type pageUserParams = {
    page: PageSysUser;
  };

  type PhysicalMemory = {
    bankLabel?: string;
    capacity?: number;
    clockSpeed?: number;
    manufacturer?: string;
    memoryType?: string;
    partNumber?: string;
    serialNumber?: string;
  };

  type PhysicalProcessor = {
    physicalPackageNumber?: number;
    physicalProcessorNumber?: number;
    efficiency?: number;
    idString?: string;
  };

  type ProcessorCache = {
    level?: string;
    associativity?: string;
    lineSize?: number;
    cacheSize?: number;
    type?: "Unified" | "Instruction" | "Data" | "Trace";
  };

  type ProcessorIdentifier = {
    processorID?: string;
    cpu64bit?: boolean;
    name?: string;
    family?: string;
    identifier?: string;
    model?: string;
    vendor?: string;
    microarchitecture?: string;
    stepping?: string;
    vendorFreq?: number;
  };

  type Server = {
    cpu?: Cpu;
    mem?: Mem;
    jvm?: Jvm;
    sys?: Sys;
    sysFiles?: SysFile[];
    sysInfo?: Record<string, any>;
    cpuInfo?: CentralProcessor;
    jvmInfo?: Record<string, any>;
    memInfo?: GlobalMemory;
  };

  type Sys = {
    computerName?: string;
    computerIp?: string;
    userDir?: string;
    osName?: string;
    osArch?: string;
  };

  type SysFile = {
    dirName?: string;
    sysTypeName?: string;
    typeName?: string;
    total?: string;
    free?: string;
    used?: string;
    usage?: number;
  };

  type SysMenu = {
    menuId?: number;
    menuName?: string;
    parentId?: number;
    orderNum?: number;
    perms?: string;
    url?: string;
    menuType?: string;
    icon?: string;
    createTime?: string;
    updateTime?: string;
    children?: SysMenu[];
  };

  type SysOperaLog = {
    operaId?: number;
    title?: string;
    businessType?: number;
    method?: string;
    requestMethod?: string;
    operaName?: string;
    operaUrl?: string;
    operaIp?: string;
    operaLocation?: string;
    operaParam?: string;
    jsonResult?: string;
    status?: number;
    errorMsg?: string;
    operaTime?: string;
    costTime?: number;
  };

  type SysRole = {
    roleId?: number;
    roleName?: string;
    roleKey?: string;
    status?: string;
    createTime?: string;
  };

  type SysUser = {
    userId?: number;
    username?: string;
    password?: string;
    nickname?: string;
    avatar?: string;
    email?: string;
    status?: string;
    createTime?: string;
    updateTime?: string;
  };

  type UserLoginDto = {
    username?: string;
    password?: string;
  };

  type VirtualMemory = {
    virtualInUse?: number;
    swapTotal?: number;
    swapPagesIn?: number;
    swapUsed?: number;
    virtualMax?: number;
    swapPagesOut?: number;
  };
}
